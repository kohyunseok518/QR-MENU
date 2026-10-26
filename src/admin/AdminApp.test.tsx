// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Session } from "@supabase/supabase-js";

const mocks = vi.hoisted(() => ({
  getSession: vi.fn(),
  signIn: vi.fn(),
  subscribe: vi.fn(),
  signOut: vi.fn(),
  callback: null as null | ((event: string, session: Session | null) => void),
}));
vi.mock("./client", () => ({
  getAdminClient: () => ({
    auth: {
      getSession: mocks.getSession,
      signInWithPassword: mocks.signIn,
      onAuthStateChange: mocks.subscribe,
      signOut: mocks.signOut,
    },
  }),
}));
vi.mock("./AdminWorkspace", () => ({
  AdminWorkspace: ({
    email,
    onLogout,
  }: {
    email: string;
    onLogout: () => void;
  }) => (
    <section>
      <p>관리 중: {email}</p>
      <button onClick={onLogout}>테스트 로그아웃</button>
    </section>
  ),
}));
import AdminApp from "./AdminApp";

beforeEach(() => {
  vi.clearAllMocks();
  mocks.getSession.mockResolvedValue({ data: { session: null }, error: null });
  mocks.subscribe.mockImplementation((callback) => {
    mocks.callback = callback;
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
});
afterEach(cleanup);

function session(anonymous = false) {
  return {
    user: {
      id: "admin-test",
      email: "admin@example.test",
      is_anonymous: anonymous,
    },
  } as Session;
}

describe("administrator authentication", () => {
  it("shows only the login form without a session and hides the password initially", async () => {
    render(<AdminApp />);
    const password = await screen.findByLabelText("비밀번호", {
      selector: "input",
    });
    expect(password).toHaveAttribute("type", "password");
    expect(screen.queryByText(/관리 중/)).not.toBeInTheDocument();
    await userEvent.click(
      screen.getByRole("button", { name: "비밀번호 보기" }),
    );
    expect(password).toHaveAttribute("type", "text");
  });
  it("shows invalid-login feedback and clears the password", async () => {
    mocks.signIn.mockResolvedValue({
      data: {},
      error: { code: "invalid_credentials" },
    });
    render(<AdminApp />);
    await screen.findByRole("heading", { name: "관리자 로그인" });
    await userEvent.type(screen.getByLabelText("이메일"), "admin@example.test");
    await userEvent.type(
      screen.getByLabelText("비밀번호", { selector: "input" }),
      "test-password-only",
    );
    await userEvent.click(screen.getByRole("button", { name: "로그인" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "이메일 또는 비밀번호",
    );
    expect(
      screen.getByLabelText("비밀번호", { selector: "input" }),
    ).toHaveValue("");
  });
  it("responds to sign-in and sign-out events", async () => {
    render(<AdminApp />);
    await screen.findByRole("heading", { name: "관리자 로그인" });
    act(() => mocks.callback!("SIGNED_IN", session()));
    expect(
      await screen.findByText("관리 중: admin@example.test"),
    ).toBeInTheDocument();
    act(() => mocks.callback!("SIGNED_OUT", null));
    expect(
      await screen.findByRole("heading", { name: "관리자 로그인" }),
    ).toBeInTheDocument();
  });
  it("does not open management for an anonymous Auth session", async () => {
    mocks.getSession.mockResolvedValue({
      data: { session: session(true) },
      error: null,
    });
    render(<AdminApp />);
    expect(
      await screen.findByRole("heading", { name: "관리자 로그인" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/관리 중/)).not.toBeInTheDocument();
  });
  it("does not resurrect an old session after sign-out while initialization is pending", async () => {
    let resolve!: (value: unknown) => void;
    mocks.getSession.mockReturnValue(
      new Promise((done) => {
        resolve = done;
      }),
    );
    render(<AdminApp />);
    await waitFor(() => expect(mocks.callback).not.toBeNull());
    act(() => mocks.callback!("SIGNED_OUT", null));
    await act(async () => {
      resolve({ data: { session: session() }, error: null });
    });
    expect(
      screen.getByRole("heading", { name: "관리자 로그인" }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/관리 중/)).not.toBeInTheDocument();
  });
});
