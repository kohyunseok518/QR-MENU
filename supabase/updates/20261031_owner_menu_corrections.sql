-- Owner-supplied corrections / 2026-10-31. Apply once in SQL Editor.
-- Existing prices/categories/images/origins/allergen review are preserved.
-- New unpriced items are hidden drafts: 0 is a placeholder, not a selling price.
-- Uncooked ribs are removed from the guest menu by a reversible hidden status.
begin;
create temporary table qr_owner_prices on commit drop as select id,price from public.menu_items;
create temporary table qr_owner_updates on commit drop as
select * from jsonb_to_recordset($corrections$
[
  {
    "id": "20000000-0000-4000-8000-000000000001",
    "description_ko": "소뼈를 푹 끓인 육수에 소고기와 채소를 넣어 끓인 음식입니다.",
    "description_en": "A soup made with beef and vegetables in a long-simmered beef bone broth.",
    "description_zh_hans": "以长时间熬煮的牛骨汤为底，加入牛肉和蔬菜烹制的汤品。",
    "description_zh_hant": "以長時間熬煮的牛骨湯為底，加入牛肉和蔬菜烹製的湯品。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000003",
    "description_ko": "소뼈를 푹 끓인 육수에 소 내장과 채소를 넣어 끓인 음식입니다.",
    "description_en": "A soup made with beef offal and vegetables in a long-simmered beef bone broth.",
    "description_zh_hans": "以长时间熬煮的牛骨汤为底，加入牛内脏和蔬菜烹制的汤品。",
    "description_zh_hant": "以長時間熬煮的牛骨湯為底，加入牛內臟和蔬菜烹製的湯品。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000002",
    "description_ko": "돼지뼈를 푹 끓인 국물에 돼지고기와 해초인 모자반을 넣어 끓인 제주 향토 음식입니다.",
    "description_en": "A traditional Jeju soup made with pork and gulfweed in a long-simmered pork bone broth.",
    "description_zh_hans": "以长时间熬煮的猪骨汤为底，加入猪肉和马尾藻烹制的济州传统汤品。",
    "description_zh_hant": "以長時間熬煮的豬骨湯為底，加入豬肉和馬尾藻烹製的濟州傳統湯品。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000004",
    "description_ko": "멸치 육수에 황태와 채소, 두부, 계란을 넣고 끓인 음식입니다.",
    "description_en": "A soup made with dried pollock, vegetables, tofu and egg in an anchovy broth.",
    "description_zh_hans": "以鳀鱼汤为底，加入干明太鱼、蔬菜、豆腐和鸡蛋烹制的汤品。",
    "description_zh_hant": "以鯷魚湯為底，加入乾明太魚、蔬菜、豆腐和雞蛋烹製的湯品。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000007",
    "description_ko": "양념에 재운 돼지고기를 불에 구워 먹는 음식입니다.",
    "description_en": "Marinated pork grilled over a flame.",
    "description_zh_hans": "将腌制入味的猪肉放在火上烤制而成。",
    "description_zh_hant": "將醃製入味的豬肉放在火上烤製而成。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000006",
    "description_ko": "돼지고기를 양념으로 조리한 음식입니다. 매운맛·중간맛·간장맛을 선택할 수 있으며, 치즈떡이 들어갑니다.",
    "description_en": "Braised pork with cheese-filled rice cakes. Available in spicy, medium-spicy or soy sauce flavors.",
    "description_zh_hans": "调味炖猪肉，内含芝士年糕。可选择辣味、中辣或酱油味。",
    "description_zh_hant": "調味燉豬肉，內含起司年糕。可選擇辣味、中辣或醬油味。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000005",
    "description_ko": "김치에 제주 흑돼지를 넣어 끓인 음식입니다.",
    "description_en": "A kimchi stew made with Jeju black pork.",
    "description_zh_hans": "加入济州黑猪肉炖煮的泡菜汤。",
    "description_zh_hant": "加入濟州黑豬肉燉煮的泡菜湯。"
  },
  {
    "id": "20000000-0000-4000-8000-000000000008",
    "description_ko": "양념한 흑돼지와 채소를 함께 볶은 음식입니다.",
    "description_en": "Marinated black pork stir-fried with vegetables.",
    "description_zh_hans": "将腌制入味的黑猪肉与蔬菜一起炒制而成。",
    "description_zh_hant": "將醃製入味的黑豬肉與蔬菜一起炒製而成。",
    "name_en": "Marinated Black Pork Stir-fry",
    "name_zh_hans": "调味黑猪肉炒菜",
    "name_zh_hant": "調味黑豬肉炒菜"
  },
  {
    "id": "20000000-0000-4000-8000-000000000011",
    "description_ko": "비빔냉면에 양념갈비를 조금 볶아 함께 제공합니다. 매운 양념장이 함께 나옵니다.",
    "description_en": "Cold noodles served with a small portion of stir-fried marinated pork ribs and a spicy sauce.",
    "description_zh_hans": "拌冷面搭配少量炒制的调味猪排骨，并附辣味拌酱。",
    "description_zh_hant": "拌冷麵搭配少量炒製的調味豬排骨，並附辣味拌醬。",
    "name_ko": "비빔갈비냉면",
    "name_en": "Spicy Cold Noodles with Pork Ribs",
    "name_zh_hans": "猪排骨拌冷面",
    "name_zh_hant": "豬排骨拌冷麵"
  },
  {
    "id": "20000000-0000-4000-8000-000000000012",
    "description_ko": "물냉면에 양념갈비를 조금 볶아 함께 제공합니다. 냉면 육수만 넣어 제공합니다.",
    "description_en": "Cold noodles in a chilled broth, served with a small portion of stir-fried marinated pork ribs.",
    "description_zh_hans": "汤冷面搭配少量炒制的调味猪排骨，冷面中只加入冷面汤。",
    "description_zh_hant": "湯冷麵搭配少量炒製的調味豬排骨，冷麵中只加入冷麵湯。",
    "name_ko": "물갈비냉면",
    "name_en": "Cold Noodle Soup with Pork Ribs",
    "name_zh_hans": "猪排骨汤冷面",
    "name_zh_hant": "豬排骨湯冷麵"
  }
]
$corrections$::jsonb) as x(
  id uuid, description_ko text, description_en text, description_zh_hans text, description_zh_hant text,
  name_ko text, name_en text, name_zh_hans text, name_zh_hant text
);
do $$
begin
  if (select count(*) from public.menu_items m join qr_owner_updates u using(id)) <> 10 then
    raise exception 'Expected 10 matching existing menu rows; no changes applied';
  end if;
end;
$$;
update public.menu_items m set
  description_ko=u.description_ko,description_en=u.description_en,
  description_zh_hans=u.description_zh_hans,description_zh_hant=u.description_zh_hant,
  name_ko=coalesce(u.name_ko,m.name_ko),name_en=coalesce(u.name_en,m.name_en),
  name_zh_hans=coalesce(u.name_zh_hans,m.name_zh_hans),name_zh_hant=coalesce(u.name_zh_hant,m.name_zh_hant)
from qr_owner_updates u where m.id=u.id;
update public.menu_items set status='hidden'
where id='20000000-0000-4000-8000-000000000010' and status <> 'hidden';

insert into public.menu_items (
 id,category_id,name_ko,name_en,name_zh_hans,name_zh_hant,
 description_ko,description_en,description_zh_hans,description_zh_hant,
 price,status,sort_order,image_path,origin_info,allergen_codes,allergen_review_status
)
select id,category_id,name_ko,name_en,name_zh_hans,name_zh_hant,
 description_ko,description_en,description_zh_hans,description_zh_hant,
 price,status,sort_order,image_path,origin_info,allergen_codes,allergen_review_status
from jsonb_populate_recordset(null::public.menu_items,$drafts$
[
  {
    "id": "c512aef4-4e0f-4f7e-a58f-e0ff69b6ff28",
    "category_id": "10000000-0000-4000-8000-000000000001",
    "name_ko": "냉동한치물회",
    "name_en": "Frozen Hanchi Squid Mulhoe",
    "name_zh_hans": "冷冻鱿鱼凉汤",
    "name_zh_hant": "冷凍魷魚涼湯",
    "description_ko": "여름에만 판매하는 메뉴로, 냉동 한치와 채소를 차가운 육수에 함께 제공합니다.",
    "description_en": "Frozen hanchi squid and vegetables served in a chilled broth. Available only in summer.",
    "description_zh_hans": "仅夏季供应。冷冻鱿鱼搭配蔬菜和冰凉汤汁一同上桌。",
    "description_zh_hant": "僅夏季供應。冷凍魷魚搭配蔬菜和冰涼湯汁一同上桌。",
    "price": 0,
    "status": "hidden",
    "sort_order": 100,
    "image_path": null,
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed"
  },
  {
    "id": "34612daa-8ed5-4365-8509-7d73ef29fdcb",
    "category_id": "10000000-0000-4000-8000-000000000003",
    "name_ko": "떡사리",
    "name_en": "Extra Cheese Rice Cakes",
    "name_zh_hans": "芝士年糕加料",
    "name_zh_hant": "起司年糕加料",
    "description_ko": "매운갈비찜에 들어가는 치즈떡 사리입니다.",
    "description_en": "An extra serving of cheese-filled rice cakes for the braised pork.",
    "description_zh_hans": "用于调味炖猪肉的芝士年糕加料。",
    "description_zh_hant": "用於調味燉豬肉的起司年糕加料。",
    "price": 0,
    "status": "hidden",
    "sort_order": 101,
    "image_path": null,
    "origin_info": [],
    "allergen_codes": [],
    "allergen_review_status": "unreviewed"
  }
]
$drafts$::jsonb) on conflict(id) do nothing;

do $$
begin
  if exists(select 1 from qr_owner_prices b join public.menu_items m using(id) where b.price <> m.price) then
    raise exception 'Existing menu prices must be preserved';
  end if;
end;
$$;
commit;
select name_ko,price,status from public.menu_items
where id in (select id from public.menu_items where name_ko in ('비빔갈비냉면','물갈비냉면','냉동한치물회','떡사리','양념갈비 (비조리·400g)'))
order by name_ko;
