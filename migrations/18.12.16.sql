--
-- PostgreSQL database dump
--

-- Dumped from database version 9.3.5
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: rax
--

CREATE TABLE categories (
    id integer NOT NULL,
    name text,
    shop_id integer,
    pid integer,
    url text,
    watch boolean DEFAULT false
);


ALTER TABLE categories OWNER TO rax;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: rax
--

CREATE SEQUENCE categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE categories_id_seq OWNER TO rax;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rax
--

ALTER SEQUENCE categories_id_seq OWNED BY categories.id;


--
-- Name: shops; Type: TABLE; Schema: public; Owner: rax
--

CREATE TABLE shops (
    id integer NOT NULL,
    name text
);


ALTER TABLE shops OWNER TO rax;

--
-- Name: shops_id_seq; Type: SEQUENCE; Schema: public; Owner: rax
--

CREATE SEQUENCE shops_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE shops_id_seq OWNER TO rax;

--
-- Name: shops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: rax
--

ALTER SEQUENCE shops_id_seq OWNED BY shops.id;


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: rax
--

ALTER TABLE ONLY categories ALTER COLUMN id SET DEFAULT nextval('categories_id_seq'::regclass);


--
-- Name: shops id; Type: DEFAULT; Schema: public; Owner: rax
--

ALTER TABLE ONLY shops ALTER COLUMN id SET DEFAULT nextval('shops_id_seq'::regclass);


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: rax
--

COPY categories (id, name, shop_id, pid, url, watch) FROM stdin;
1	muzhchiny	1	0	http://www2.hm.com/ru_ru/muzhchiny.html	f
2	zhenshchiny	1	0	http://www2.hm.com/ru_ru/zhenshchiny.html	f
7	Одежда	1	2	/ru_ru/zhenshchiny/novye-postupleniya/odezhda.html	f
8	Обувь и аксессуары	1	2	/ru_ru/zhenshchiny/novye-postupleniya/obuv-i-aksessuary.html	f
9	Куртки и пальто	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/kurtki-i-palto.html	f
10	Трикотаж	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/knitwear.html	f
11	Beauty	1	2	/ru_ru/zhenshchiny/novye-postupleniya/beauty.html	f
12	Кардиганы и джемперы	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/kardigany-i-dzhempery.html	f
13	Топы	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/topy.html	f
14	Базовые модели	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/bazovye-modeli.html	f
15	Рубашки и блузки	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/rubashki-i-bluzki.html	f
16	Пиджаки и жилеты	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/pidzhaki-i-zhilety.html	f
17	Платья	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/dresses.html	f
18	Брюки	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/bryuki.html	f
19	Джинсы	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/dzhinsy.html	f
20	Юбки	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/yubki.html	f
21	Шорты	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/shorty.html	f
22	Купить товары с фото в Instagram	1	2	/ru_ru/zhenshchiny/hm-feed/shop-the-feed---ladies.html	f
23	Комбинезоны	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/jumpsuits.html	f
24	Обувь	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/obuv.html	f
25	Белье	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/belyo.html	f
26	Одежда для сна	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/odezhda-dlya-sna.html	f
27	Носки и колготки	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/noski-i-kolgotki.html	f
28	Аксессуары	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/aksessuary.html	f
29	Спортивная одежда	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/sportivnaya-odezhda.html	f
30	Купальники	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/kupalniki.html	f
31	Одежда для беременных	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/odezhda-dlya-beremennyh.html	f
32	H&M+ Большие размеры	1	2	/ru_ru/zhenshchiny/vybrat-kategoriyu/bolshie-razmery.html	f
34	Подарки к праздникам	1	2	/ru_ru/zhenshchiny/akcii-i-predlozheniya/ru21-holiday-gift-shop-ladies.html	f
35	Новогодняя вечеринка - Эффектные вечерние модели	1	2	/ru_ru/zhenshchiny/akcii-i-predlozheniya/party-dresses.html	f
36	KENZO x H&M	1	2	/ru_ru/zhenshchiny/akcii-i-predlozheniya/kenzo-x-h-m.html	f
37	Избранные модели белья	1	2	/ru_ru/zhenshchiny/akcii-i-predlozheniya/rul23-holiday-underwear.html	f
38	Нарядная обувь!	1	2	/ru_ru/zhenshchiny/akcii-i-predlozheniya/rul25-partyshoes.html	f
39	Happy Plugs x H&M	1	2	/ru_ru/zhenshchiny/vybrat-fason/7vi-happyplugs-x-hm.html	f
40	Готичная романтика	1	2	/ru_ru/zhenshchiny/vybrat-fason/8ac-dark-romance.html	f
41	Лучшие джинсы	1	2	/ru_ru/zhenshchiny/vybrat-fason/8ae-genius-jeans.html	f
42	Кофты С Капюшоном	1	2	/ru_ru/zhenshchiny/vybrat-fason/8ad-haute-hoodies.html	f
43	Лучшее к вечеринкам – скидка 30%	1	2	/ru_ru/zhenshchiny/akcii-i-predlozheniya/ru23-party-essentials-ladies.html	f
44	Список пожеланий	1	2	/ru_ru/zhenshchiny/vybrat-fason/7yn-winter-wish-list.html	f
45	Добро в подарок	1	2	/ru_ru/zhenshchiny/vybrat-fason/7sm-the-gift-that-gives-back.html	f
46	Встречаем Новый год	1	2	/ru_ru/zhenshchiny/vybrat-fason/7ye-new-years-special.html	f
47	Броские полосы	1	2	/ru_ru/zhenshchiny/vybrat-fason/8ah-strong-stripes.html	f
48	Женская коллекция	1	2	/ru_ru/zhenshchiny/vybrat-fason/7ya-holiday-season-women.html	f
49	Trend	1	2	/ru_ru/zhenshchiny/vybrat-kollekciyu/trend.html	f
50	Modern Classic	1	2	/ru_ru/zhenshchiny/vybrat-kollekciyu/modern-classic.html	f
51	L.O.G.G.	1	2	/ru_ru/zhenshchiny/vybrat-kollekciyu/l-o-g-g.html	f
52	Divided	1	2	/ru_ru/zhenshchiny/vybrat-kollekciyu/divided.html	f
53	&Denim	1	2	/ru_ru/zhenshchiny/vybrat-kollekciyu/denim.html	f
54	Вечерняя одежда	1	2	/ru_ru/zhenshchiny/vybrat-kollekciyu/vechernyaya-odezhda.html	f
55	Conscious – Экологичный стиль	1	2	/ru_ru/zhenshchiny/vybrat-kollekciyu/conscious-sustainable-style.html	f
56	Premium Quality	1	2	/ru_ru/zhenshchiny/vybrat-kollekciyu/premium-quality.html	f
57	Одежда	1	1	/ru_ru/muzhchiny/novye-postupleniya/odezhda.html	f
58	Обувь и аксессуары	1	1	/ru_ru/muzhchiny/novye-postupleniya/obuv-i-aksessuary.html	f
59	Аксессуары	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/aksessuary.html	f
60	Базовые модели	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/basics.html	f
61	Белье	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/belyo.html	f
62	Брюки	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/bryuki.html	f
63	Джинсы	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/dzhinsy.html	f
64	Кардиганы и джемперы	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/kardigany-i-dzhempery.html	f
65	Куртки и пальто	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/kurtki-i-palto.html	f
66	Носки	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/noski.html	f
67	Обувь	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/obuv.html	f
76	Шорты	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/shorty.html	f
85	Мужская коллекция	1	1	/ru_ru/muzhchiny/vybrat-fason/7yk-holiday-season-men.html	f
93	Premium Quality	1	1	/ru_ru/muzhchiny/vybrat-kollekciyu/premium-quality.html	f
68	Купить товары с фото в Instagram	1	1	/ru_ru/muzhchiny/hm-feed/shop-the-feed---men.html	f
77	Лучшее к вечеринкам – скидка 30%	1	1	/ru_ru/muzhchiny/akcii-i-predlozheniya/ru23-party-essentials-men.html	f
86	Модный силуэт	1	1	/ru_ru/muzhchiny/vybrat-fason/7xe-modern-tailoring.html	f
94	Conscious – Экологичный стиль	1	1	/ru_ru/muzhchiny/vybrat-kollekciyu/conscious.html	f
69	Одежда для плавания	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/odezhda-dlya-plavaniya.html	f
78	Подарки к праздникам	1	1	/ru_ru/muzhchiny/akcii-i-predlozheniya/ru21-holiday-gift-shop-men.html	f
87	Purpose Tour x H&M	1	1	/ru_ru/muzhchiny/vybrat-fason/7xn-hm-x-justinbieber.html	f
95	ЖЕНЩИНЫ	1	2	/ru_ru/zhenshchiny/akcii-i-predlozheniya/ru23-party-essentials-ladies.html	f
70	Пиджаки и костюмы	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/pidzhaki-i-kostyumy.html	f
79	Новогодняя вечеринка - Подборка вечерних моделей	1	1	/ru_ru/muzhchiny/akcii-i-predlozheniya/new-years-party.html	f
97	СМОТРЕТЬ ТОВАРЫ СЕЙЧАС	1	2	/ru_ru/zhenshchiny/vybrat-fason/7ye-new-years-special.html	f
71	Рубашки	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/rubashki.html	f
88	Happy Plugs x H&M	1	1	/ru_ru/muzhchiny/vybrat-fason/7vi-happyplugs-x-hm.html	f
96	МУЖЧИНЫ	1	1	/ru_ru/muzhchiny/akcii-i-predlozheniya/ru23-party-essentials-men.html	f
72	Спортивная одежда	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/h-m-sport.html	f
81	Топ 12	1	1	/ru_ru/muzhchiny/akcii-i-predlozheniya/mr65-top-12.html	f
89	Modern Classic	1	1	/ru_ru/muzhchiny/vybrat-kollekciyu/modern-classic.html	f
73	Футболки и майки	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/futbolki-i-majki.html	f
82	Эксклюзивно онлайн	1	1	/ru_ru/muzhchiny/akcii-i-predlozheniya/online-exclusive.html	f
90	Trend	1	1	/ru_ru/muzhchiny/vybrat-kollekciyu/trend.html	f
74	Худи и толстовки	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/hudi-i-tolstovki.html	f
83	KENZO x H&M	1	1	/ru_ru/muzhchiny/vybrat-fason/7sb-kenzo-men.html	f
91	Divided	1	1	/ru_ru/muzhchiny/vybrat-kollekciyu/divided.html	f
75	Широкий размерный ряд	1	1	/ru_ru/muzhchiny/vybrat-kategoriyu/extended-sizes.html	f
102	ПРОЧИТАТЬ ПОДРОБНЕЕ	1	2	/ru_ru/zhenshchiny/vybrat-fason/7sm-the-gift-that-gives-back.html	f
80	Гардероб для отличного отдыха	1	1	/ru_ru/muzhchiny/akcii-i-predlozheniya/the-vacation-wardrobe.html	f
98	СМОТРЕТЬ ТОВАРЫ СЕЙЧАС	1	1	/ru_ru/muzhchiny/vybrat-fason/7yk-holiday-season-men.html	f
\.


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rax
--

SELECT pg_catalog.setval('categories_id_seq', 102, true);


--
-- Data for Name: shops; Type: TABLE DATA; Schema: public; Owner: rax
--

COPY shops (id, name) FROM stdin;
1	h&m
\.


--
-- Name: shops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: rax
--

SELECT pg_catalog.setval('shops_id_seq', 1, true);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: rax
--

ALTER TABLE ONLY categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: shops shops_pkey; Type: CONSTRAINT; Schema: public; Owner: rax
--

ALTER TABLE ONLY shops
    ADD CONSTRAINT shops_pkey PRIMARY KEY (id);


--
-- Name: categories_compound_uniq; Type: INDEX; Schema: public; Owner: rax
--

CREATE UNIQUE INDEX categories_compound_uniq ON categories USING btree (name, shop_id, pid);


--
-- Name: public; Type: ACL; Schema: -; Owner: rax
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM rax;
GRANT ALL ON SCHEMA public TO rax;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

