SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.6
-- Dumped by pg_dump version 15.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'faf53765-bcea-459b-8771-4e4dbb122843', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@naver.com","user_id":"f91fdc0a-b4b1-462a-8141-c0002a86d7bf","user_phone":""}}', '2024-11-29 06:24:01.314605+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ab1f35bb-cbc3-441c-bd9a-87016bd4d30c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rkdckdfyyd@naver.com","user_id":"e7154e3e-6b77-4128-9b1d-df3c57e9f8dc","user_phone":""}}', '2024-11-30 03:48:23.188361+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa61afea-adbe-4d53-a1d6-43894534a903', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"asdf@naver.com","user_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","user_phone":""}}', '2024-11-30 04:06:55.847159+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ad9b6159-089e-4d77-8c3d-be89c239212a', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-11-30 04:07:15.23349+00', ''),
	('00000000-0000-0000-0000-000000000000', '5fdd4a92-d305-47ad-b5b7-8d2df0fe5e96', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-11-30 08:34:44.849101+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cdab293b-9be4-4580-9a60-312104bcd1e4', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-11-30 08:34:44.86375+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc4f802e-bb97-495a-be02-22ee895372f2', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-02 00:06:04.027519+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ea12d8e3-80bb-437c-ab8b-a255f7418a01', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-02 00:06:04.048761+00', ''),
	('00000000-0000-0000-0000-000000000000', '78534720-15e4-49d2-ab71-4f79b5755ae4', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-04 01:59:29.141354+00', ''),
	('00000000-0000-0000-0000-000000000000', '7da8332d-63c8-4a40-bde5-a37dc2bdaedc', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-04 01:59:29.148293+00', ''),
	('00000000-0000-0000-0000-000000000000', '090d12bb-25ef-46b2-84a3-2b80c77b750e', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 13:11:50.775579+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a6b92efc-3ef3-483a-a51b-46a8e469b122', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 13:11:50.783738+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a84a8398-517f-4cb8-ad95-c7a4b7679891', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 14:44:36.24093+00', ''),
	('00000000-0000-0000-0000-000000000000', '547efa4b-8952-4d17-93bc-19392dedbc26', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-05 14:44:36.241819+00', ''),
	('00000000-0000-0000-0000-000000000000', '2daf01d7-4443-4e18-903f-f17ee73c1545', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-05 14:45:13.583771+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a13df0a-a2fe-40a2-a510-d84a0057e4b5', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 04:23:20.193765+00', ''),
	('00000000-0000-0000-0000-000000000000', '914f1b32-e08e-430a-884d-b1152cf9cca1', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 04:23:20.199814+00', ''),
	('00000000-0000-0000-0000-000000000000', '681dfa3e-5717-4b86-9f33-97f02cf982f6', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-06 04:55:01.90188+00', ''),
	('00000000-0000-0000-0000-000000000000', '8aa43235-aaae-45f7-af83-d9b0e208f8b3', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-06 05:19:05.771973+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d03e542-c54d-4ea4-b89b-41ad4b304259', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 06:20:41.606201+00', ''),
	('00000000-0000-0000-0000-000000000000', '142212e9-5f91-45b0-8b27-6102e1196487', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 06:20:41.608359+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b79b819-0cd9-4b52-ba48-2ecd186efd4c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rkdckdfyyd@naver.com","user_id":"e7154e3e-6b77-4128-9b1d-df3c57e9f8dc","user_phone":""}}', '2024-12-06 06:32:37.80233+00', ''),
	('00000000-0000-0000-0000-000000000000', '40ea5fbc-b419-44f0-abf6-526dd3571182', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"admin@naver.com","user_id":"f91fdc0a-b4b1-462a-8141-c0002a86d7bf","user_phone":""}}', '2024-12-06 06:32:48.841512+00', ''),
	('00000000-0000-0000-0000-000000000000', '7af1daa3-d0eb-4599-a885-b4addbe39175', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ksw@ytmedia.co.kr","user_id":"2c26dfbf-e5a4-4137-914d-32c6e428a337","user_phone":""}}', '2024-12-06 06:40:26.972334+00', ''),
	('00000000-0000-0000-0000-000000000000', 'de64836b-5240-4a62-be1d-03998186b6d5', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-06 06:40:44.023248+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b2a6d339-c407-4e15-b86c-f044d6b2ce6d', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-06 06:42:55.335909+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e0f6b8d6-b4e7-4979-875d-8aac3f639db9', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rkdckdfyyd@naver.com","user_id":"554daa18-d5bc-4206-b631-7a146a829988","user_phone":""}}', '2024-12-06 06:44:37.103044+00', ''),
	('00000000-0000-0000-0000-000000000000', '53c9d3eb-0563-4f90-9aaf-184ea6d83552', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-06 06:47:33.349006+00', ''),
	('00000000-0000-0000-0000-000000000000', '5182b8ce-12ff-4ad6-8780-0523217fb769', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"fornia@hanmail.net","user_id":"1497f37d-c3bc-4c4b-bbfe-a9c61e3b2400","user_phone":""}}', '2024-12-06 06:51:25.552348+00', ''),
	('00000000-0000-0000-0000-000000000000', '94d7e004-8758-4b3b-8a43-df32491f3346', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ihkoo@hidayone.com","user_id":"b412c2ce-8b1c-47f6-a4f7-3538a99e7313","user_phone":""}}', '2024-12-06 06:51:58.981218+00', ''),
	('00000000-0000-0000-0000-000000000000', '3ae9de01-4af0-4863-9aaf-310ef55baa4f', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"1015@handpartners.co.kr","user_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","user_phone":""}}', '2024-12-06 06:52:17.815643+00', ''),
	('00000000-0000-0000-0000-000000000000', '6140ac0c-a0fc-4946-983e-cd6f0a5d345c', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"csy@ynarcher.com","user_id":"a368194a-156c-4767-80fe-2edf6a84dc26","user_phone":""}}', '2024-12-06 06:53:10.17501+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ef35a17d-b126-40bf-a701-f0c93a9f0281', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sbhan@miraeholding.com","user_id":"26a2d7c6-2eec-40d6-ac9c-852b92790f7f","user_phone":""}}', '2024-12-06 06:53:26.226839+00', ''),
	('00000000-0000-0000-0000-000000000000', '854ef0db-5d70-44f3-a5a4-1c42ada7e18e', '{"action":"login","actor_id":"b412c2ce-8b1c-47f6-a4f7-3538a99e7313","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-06 07:03:04.688567+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf992259-851f-4f73-bc69-2b787df14762', '{"action":"logout","actor_id":"b412c2ce-8b1c-47f6-a4f7-3538a99e7313","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"account"}', '2024-12-06 07:38:23.053295+00', ''),
	('00000000-0000-0000-0000-000000000000', '233f5002-96d7-4778-bac2-f125f6361e4a', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-06 07:38:36.629221+00', ''),
	('00000000-0000-0000-0000-000000000000', '5f6720a3-d414-44db-94f5-bfa178c43069', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-06 07:38:42.247939+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c7c35ed-7250-4435-a796-6f7baa126b48', '{"action":"login","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-06 07:39:16.742144+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c3529e2d-7e18-4bae-a282-7e9ee0425e00', '{"action":"logout","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-06 07:41:47.383951+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e499ed1a-1d2d-47e1-ba4a-382c0dd1f9bd', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-06 07:42:02.515669+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd81a7de0-94d4-4514-a62c-3faf857fb827', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 08:42:35.271007+00', ''),
	('00000000-0000-0000-0000-000000000000', '0374f10a-b7f2-4f69-b051-42000b5f0886', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 08:42:35.273584+00', ''),
	('00000000-0000-0000-0000-000000000000', '97409189-a328-4620-a2a9-6824c8233171', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 08:42:35.305411+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd1a41c8a-8202-4f67-8452-1900a43451a4', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 08:42:36.324034+00', ''),
	('00000000-0000-0000-0000-000000000000', '40e9869c-a327-48ad-b771-5a8e4149ca3a', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 08:42:36.390581+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c8f9452-d03d-4a40-be46-f488a8fdcf42', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 10:11:28.117954+00', ''),
	('00000000-0000-0000-0000-000000000000', '6513c000-89d0-498f-a20f-5fd8d48980b3', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 10:11:28.118984+00', ''),
	('00000000-0000-0000-0000-000000000000', '5dd6a087-2220-4aaf-b396-a6e87b9bdfbb', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 11:11:34.565755+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e6023ffb-306c-4692-b6c1-8291aa93bfe6', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 11:11:34.568551+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e4532f8d-9dd8-44e5-975d-6dad70e61e16', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 11:11:34.59714+00', ''),
	('00000000-0000-0000-0000-000000000000', '21c2e62a-85be-42a9-a8c7-d96c7a5b988c', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 11:11:35.1883+00', ''),
	('00000000-0000-0000-0000-000000000000', '274ad22f-08b2-4345-9bfa-630978ee2db1', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 11:11:35.226473+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aa94aa65-95a2-4886-ab44-676537d25ac0', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 11:11:35.298104+00', ''),
	('00000000-0000-0000-0000-000000000000', '658adeee-9195-44bb-a502-2337fd174dc7', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 12:12:50.493321+00', ''),
	('00000000-0000-0000-0000-000000000000', '6d38aba0-2de7-4efe-9184-2a8d8640c99d', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 12:12:50.499041+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf6445cf-7449-4da0-a61f-a4408bfb11f2', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 13:15:37.011568+00', ''),
	('00000000-0000-0000-0000-000000000000', '4754a7f3-6fea-4590-a2c2-e4595993b872', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 13:15:37.012868+00', ''),
	('00000000-0000-0000-0000-000000000000', '5075e144-d224-4d8a-9d1f-ea446cb92288', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 23:16:41.598313+00', ''),
	('00000000-0000-0000-0000-000000000000', '520b6126-fb3e-4261-b341-295248abb824', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-06 23:16:41.609807+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ee2a4a75-a726-4c61-be16-3d51d29216b9', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 00:47:53.074602+00', ''),
	('00000000-0000-0000-0000-000000000000', '6aa5c88e-e12f-4429-93f0-b6922db7c3d4', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 00:47:53.076974+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd316288c-59f7-41ef-8b3d-b14307d3bb94', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 01:30:42.863578+00', ''),
	('00000000-0000-0000-0000-000000000000', '28228bf0-6973-49c6-a908-7b08840d7184', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 01:30:55.211169+00', ''),
	('00000000-0000-0000-0000-000000000000', '82c5d929-4b80-4f97-acaa-eff8e6297d77', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 01:32:41.699023+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f183e3c4-6490-4ae0-9249-6475957214a0', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 01:47:05.905578+00', ''),
	('00000000-0000-0000-0000-000000000000', '885e816f-9be9-4f32-8d11-8ad8a8f364e2', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 01:48:12.310647+00', ''),
	('00000000-0000-0000-0000-000000000000', '8e59476f-3b89-4de5-b6cc-6193f824491a', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 01:48:21.596869+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d2c4e7a-d387-48a4-9a6f-0770ec348933', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 01:48:31.572862+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df2961e3-289f-477a-bd7f-f85550784f73', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 01:48:55.108898+00', ''),
	('00000000-0000-0000-0000-000000000000', '5fe94a35-33e7-4abc-bc19-e0bce871c920', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:40:13.017755+00', ''),
	('00000000-0000-0000-0000-000000000000', '84f5aecf-0686-4d20-aaa5-566a2e313e6c', '{"action":"login","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:40:22.471394+00', ''),
	('00000000-0000-0000-0000-000000000000', '75954903-267a-4e09-a737-a81b0a74ea1c', '{"action":"logout","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:44:58.03093+00', ''),
	('00000000-0000-0000-0000-000000000000', '4db5b373-7b5a-460c-a29f-9f52d33607a9', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:45:08.564303+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ba0eb342-adaa-46e2-aa50-4eaff5d036ac', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:45:27.867688+00', ''),
	('00000000-0000-0000-0000-000000000000', '6e8f2a8b-e61b-4c68-b971-a648b986ac3f', '{"action":"login","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:45:40.990875+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bcf7b229-a5b2-46dd-afe2-b8059a5cd706', '{"action":"logout","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:45:49.743641+00', ''),
	('00000000-0000-0000-0000-000000000000', '98d75366-bd18-4fda-8156-8d6f5824afc3', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:45:56.920351+00', ''),
	('00000000-0000-0000-0000-000000000000', '4a13f7bd-2dbc-42d5-b6be-f4d422b66a31', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:46:55.879049+00', ''),
	('00000000-0000-0000-0000-000000000000', 'da1979d1-09fc-4e2e-8c39-f7ff155de7ea', '{"action":"login","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:47:04.109667+00', ''),
	('00000000-0000-0000-0000-000000000000', '812902ac-8cbc-4371-a3f6-c695e9c2ac5f', '{"action":"logout","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:47:07.616105+00', ''),
	('00000000-0000-0000-0000-000000000000', 'aabd9810-92cd-4070-9f6e-3f4b95d14b9d', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:47:14.671372+00', ''),
	('00000000-0000-0000-0000-000000000000', '9c1d6f9e-b76a-4f03-909e-da5e74b0ed9c', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:50:12.846364+00', ''),
	('00000000-0000-0000-0000-000000000000', '9bb88316-840a-4d09-b42e-2a7a1b4373ef', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:52:11.176522+00', ''),
	('00000000-0000-0000-0000-000000000000', '5dae2d71-51b7-46df-97ad-c67470f3cc87', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:57:58.01833+00', ''),
	('00000000-0000-0000-0000-000000000000', '07b5d849-f765-4aa2-bdea-55371b69fe41', '{"action":"login","actor_id":"26a2d7c6-2eec-40d6-ac9c-852b92790f7f","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:58:36.117817+00', ''),
	('00000000-0000-0000-0000-000000000000', '440c5589-4b11-4aef-97da-274aea7d300a', '{"action":"logout","actor_id":"26a2d7c6-2eec-40d6-ac9c-852b92790f7f","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:58:47.124117+00', ''),
	('00000000-0000-0000-0000-000000000000', '3bdbd5e3-1488-41bb-95b0-cde4c67abf82', '{"action":"login","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:59:04.127103+00', ''),
	('00000000-0000-0000-0000-000000000000', '80844c7e-03fd-42c2-98c0-4dd86a270cb8', '{"action":"logout","actor_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:59:12.488769+00', ''),
	('00000000-0000-0000-0000-000000000000', '2c1be5c1-de44-4b21-9447-a8c61d002b5d', '{"action":"login","actor_id":"b412c2ce-8b1c-47f6-a4f7-3538a99e7313","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 02:59:16.479763+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e987e64-5f4f-4e4e-80d7-f27aeefd42bf', '{"action":"logout","actor_id":"b412c2ce-8b1c-47f6-a4f7-3538a99e7313","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 02:59:30.5336+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e3565e2-7161-48ad-9449-14476cee0f0e', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 03:01:28.065554+00', ''),
	('00000000-0000-0000-0000-000000000000', '43cf543b-8e24-4069-9f27-1bae606a317d', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 03:01:29.871191+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bef5d733-df7e-4375-8e47-4f0510bbbe4b', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"csy@ynarcher.com","user_id":"a368194a-156c-4767-80fe-2edf6a84dc26","user_phone":""}}', '2024-12-07 04:18:49.92126+00', ''),
	('00000000-0000-0000-0000-000000000000', '442fead4-7bcb-4bb2-80e6-ba7d11c3846e', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"csy@ynarcher.com","user_id":"b15c1bc0-6110-4b90-9619-e86730e7f395","user_phone":""}}', '2024-12-07 04:19:02.136069+00', ''),
	('00000000-0000-0000-0000-000000000000', '56b22c49-c4a0-430e-9075-6421dbd04bb5', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"csy@ynarcher.com","user_id":"b15c1bc0-6110-4b90-9619-e86730e7f395","user_phone":""}}', '2024-12-07 04:19:20.02296+00', ''),
	('00000000-0000-0000-0000-000000000000', 'edb818f3-0ba2-4044-a8ce-ef4eece74af0', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"csy@ynarcher.com","user_id":"2491dba0-2881-4897-90c2-4054809dba90","user_phone":""}}', '2024-12-07 04:19:34.807555+00', ''),
	('00000000-0000-0000-0000-000000000000', '7cf92e2b-8c23-4d3f-9375-d38ed871d5a3', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"fornia@hanmail.net","user_id":"1497f37d-c3bc-4c4b-bbfe-a9c61e3b2400","user_phone":""}}', '2024-12-07 04:20:23.294619+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a658f342-4506-4e01-8f08-9d8145c5c7dd', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"fornia@hanmail.net","user_id":"da85b69e-f49b-4787-a40d-28bcea7bd39c","user_phone":""}}', '2024-12-07 04:20:46.468785+00', ''),
	('00000000-0000-0000-0000-000000000000', '9cabf460-b996-4479-9189-ee6489a55bb7', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jknadan@naver.com","user_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","user_phone":""}}', '2024-12-07 04:22:57.92123+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd69790df-80a4-480f-b82f-571f697ae215', '{"action":"user_recovery_requested","actor_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"user"}', '2024-12-07 04:23:42.980277+00', ''),
	('00000000-0000-0000-0000-000000000000', '04672d80-2b93-48bc-9411-b1ba17f9fc5e', '{"action":"login","actor_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 04:23:55.138827+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c5ae7a5-8f67-47b3-984d-d6b685180c9c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rkdckdfyyd@naver.com","user_id":"554daa18-d5bc-4206-b631-7a146a829988","user_phone":""}}', '2024-12-07 04:24:28.62617+00', ''),
	('00000000-0000-0000-0000-000000000000', '142f87d9-592a-4f8b-9e40-ecd30759502a', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ksw@ytmedia.co.kr","user_id":"2c26dfbf-e5a4-4137-914d-32c6e428a337","user_phone":""}}', '2024-12-07 04:25:28.965488+00', ''),
	('00000000-0000-0000-0000-000000000000', '5a39987e-46e9-4bf3-9db9-fdc538145c43', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"fornia@hanmail.net","user_id":"da85b69e-f49b-4787-a40d-28bcea7bd39c","user_phone":""}}', '2024-12-07 04:26:57.156719+00', ''),
	('00000000-0000-0000-0000-000000000000', '21cbde7a-8633-4cca-a251-d77a8901969c', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"csy@ynarcher.com","user_id":"2491dba0-2881-4897-90c2-4054809dba90","user_phone":""}}', '2024-12-07 04:28:17.110041+00', ''),
	('00000000-0000-0000-0000-000000000000', '2e128f3a-23d2-4a80-89a6-79fb3a946af4', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sbhan@miraeholding.com","user_id":"26a2d7c6-2eec-40d6-ac9c-852b92790f7f","user_phone":""}}', '2024-12-07 04:31:46.877856+00', ''),
	('00000000-0000-0000-0000-000000000000', '44e9aa46-d08f-4fde-b28a-d56cf3fe93b5', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"1015@handpartners.co.kr","user_id":"a74cfc11-6bdf-4470-842e-7d60b3f31939","user_phone":""}}', '2024-12-07 04:32:26.07237+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5ef1935-3e5f-4405-9952-eb5665d4aa74', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ihkoo@hidayone.com","user_id":"b412c2ce-8b1c-47f6-a4f7-3538a99e7313","user_phone":""}}', '2024-12-07 04:33:06.923125+00', ''),
	('00000000-0000-0000-0000-000000000000', '48652edb-ac59-40b0-b61e-bbaafea0bbbe', '{"action":"user_recovery_requested","actor_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"user"}', '2024-12-07 04:43:59.099091+00', ''),
	('00000000-0000-0000-0000-000000000000', '33a30050-0945-4f0d-b5c9-8d6c9db44b8a', '{"action":"login","actor_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 04:45:40.481198+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a41d1229-c61f-4283-b026-3b89e46293b0', '{"action":"login","actor_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 04:49:08.350072+00', ''),
	('00000000-0000-0000-0000-000000000000', '1e16ace3-2de7-4ac8-9bd7-2ec84917e3d3', '{"action":"user_recovery_requested","actor_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"user"}', '2024-12-07 04:51:43.72402+00', ''),
	('00000000-0000-0000-0000-000000000000', '32665736-c956-4bc5-99ae-c304b0ec6a44', '{"action":"login","actor_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 04:51:53.902638+00', ''),
	('00000000-0000-0000-0000-000000000000', 'afb6389f-cc6d-4c98-a693-aca98469abaf', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ksw@ytmedia.co.kr","user_id":"80eee7f9-8daa-493f-a794-45968643fe8c","user_phone":""}}', '2024-12-07 04:55:14.495182+00', ''),
	('00000000-0000-0000-0000-000000000000', '8fd3f0d4-d5e7-4ec2-8a01-1a9772901d50', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"fornia@hanmail.net","user_id":"19f156af-887b-424a-9a23-d7be2551d562","user_phone":""}}', '2024-12-07 04:55:38.721507+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd3fd0c14-e334-41e3-856b-7205829fccca', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"ihkoo@hidayone.com","user_id":"79531851-315d-4015-9b98-b8d6d71cc8d6","user_phone":""}}', '2024-12-07 04:55:57.506035+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a337860c-7450-4315-aae4-25cf689bbca2', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"1015@handpartners.co.kr","user_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","user_phone":""}}', '2024-12-07 04:56:18.67769+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac8a6ebb-e1fc-475a-85d2-8585aa276187', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"csy@ynarcher.com","user_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","user_phone":""}}', '2024-12-07 04:56:36.773248+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cef59125-c158-43bc-94dd-6caaa5cf703f', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"sbhan@miraeholding.com","user_id":"e0ad02e0-252e-4829-9272-592819e864dc","user_phone":""}}', '2024-12-07 04:56:55.849766+00', ''),
	('00000000-0000-0000-0000-000000000000', '7bb69241-5b2f-4155-813f-840252550a53', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"supabase_admin","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rkdckdfyyd@naver.com","user_id":"0d9079d3-ef5e-4852-9256-b5f6a2d31c39"}}', '2024-12-07 05:00:51.977865+00', ''),
	('00000000-0000-0000-0000-000000000000', '114b4419-c4cd-4197-9de9-947e1f2a1969', '{"action":"user_signedup","actor_id":"0d9079d3-ef5e-4852-9256-b5f6a2d31c39","actor_username":"rkdckdfyyd@naver.com","actor_via_sso":false,"log_type":"team"}', '2024-12-07 05:01:17.419828+00', ''),
	('00000000-0000-0000-0000-000000000000', '25298a91-392e-4daf-a7c4-e53732df4d41', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rkdckdfyyd@naver.com","user_id":"0d9079d3-ef5e-4852-9256-b5f6a2d31c39","user_phone":""}}', '2024-12-07 05:02:39.119648+00', ''),
	('00000000-0000-0000-0000-000000000000', '2be5d325-be41-4d3d-ac24-f64461d230a2', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rkdckdfyyd@naver.com","user_id":"67a09684-3b4a-4d0b-901d-163453460d11","user_phone":""}}', '2024-12-07 05:04:00.530595+00', ''),
	('00000000-0000-0000-0000-000000000000', '7c4d7a3b-3dec-498e-8280-407edae4d629', '{"action":"user_recovery_requested","actor_id":"67a09684-3b4a-4d0b-901d-163453460d11","actor_username":"rkdckdfyyd@naver.com","actor_via_sso":false,"log_type":"user"}', '2024-12-07 05:04:18.501548+00', ''),
	('00000000-0000-0000-0000-000000000000', '28d99a65-0003-4fa0-b6e9-c592d18ca185', '{"action":"login","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 05:06:06.809266+00', ''),
	('00000000-0000-0000-0000-000000000000', '74732266-3208-4512-8e15-5805ec7bf899', '{"action":"logout","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 05:06:17.787094+00', ''),
	('00000000-0000-0000-0000-000000000000', '88b15e59-427c-493c-916f-7ff43ad719ad', '{"action":"login","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 05:11:03.055244+00', ''),
	('00000000-0000-0000-0000-000000000000', '97fc3eee-269e-4a80-8f4d-f3607fbb7bf9', '{"action":"logout","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-07 05:11:05.495262+00', ''),
	('00000000-0000-0000-0000-000000000000', '9dbe5f9c-79a6-419b-900a-c1564eb4ac91', '{"action":"login","actor_id":"80eee7f9-8daa-493f-a794-45968643fe8c","actor_username":"ksw@ytmedia.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 05:11:49.757685+00', ''),
	('00000000-0000-0000-0000-000000000000', '07df9088-9a72-4139-ab23-e8161c94752f', '{"action":"logout","actor_id":"80eee7f9-8daa-493f-a794-45968643fe8c","actor_username":"ksw@ytmedia.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-07 05:11:53.606689+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cf07fc16-c051-473c-a62e-30653f5b66e7', '{"action":"login","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 05:13:33.721665+00', ''),
	('00000000-0000-0000-0000-000000000000', '9d8e2d5d-6c86-4b80-94c3-aa6cfd3424c4', '{"action":"logout","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 05:17:09.435474+00', ''),
	('00000000-0000-0000-0000-000000000000', '64dcdf51-9c32-47bd-bc1e-f715d370b690', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 05:27:33.092607+00', ''),
	('00000000-0000-0000-0000-000000000000', '85fb507a-ebb1-4576-bd93-a254400e36d7', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 05:40:01.153694+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c8d0f5a7-0d21-4b57-bac1-3cdf72d607d1', '{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jknadan@naver.com","user_id":"1b04e00a-9f72-4b02-8d17-16bf1c8a91d0","user_phone":""}}', '2024-12-07 06:00:24.462723+00', ''),
	('00000000-0000-0000-0000-000000000000', '22f3f132-86a3-40fa-91ed-d9dc89efda01', '{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"jknadan@naver.com","user_id":"f2e0b4a8-5d86-4e09-a72d-24c14cabf091","user_phone":""}}', '2024-12-07 06:06:36.963103+00', ''),
	('00000000-0000-0000-0000-000000000000', '4ec69e7a-ba46-49ff-a4e0-97a85709e7ef', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 06:08:04.387849+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c0a5c6b6-4205-42eb-bff8-4219117e283b', '{"action":"login","actor_id":"f2e0b4a8-5d86-4e09-a72d-24c14cabf091","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 06:08:51.019684+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd697fb7c-9230-4381-b807-7e1d605405f6', '{"action":"logout","actor_id":"f2e0b4a8-5d86-4e09-a72d-24c14cabf091","actor_username":"jknadan@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 06:09:00.09792+00', ''),
	('00000000-0000-0000-0000-000000000000', '1c46c8f3-4704-42b3-a90c-80864b71fa92', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 06:40:28.124737+00', ''),
	('00000000-0000-0000-0000-000000000000', '1281f2fb-746b-4fc2-a929-7be4255826a6', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 06:41:13.881222+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd19f8432-42d8-4903-866c-8e8023bb395b', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 06:41:25.508012+00', ''),
	('00000000-0000-0000-0000-000000000000', '066d2413-248c-48df-8b96-b92d0aae2f7d', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 08:27:32.807159+00', ''),
	('00000000-0000-0000-0000-000000000000', '2057bc43-983f-49e0-ac9f-675e2d689be9', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 08:27:32.819973+00', ''),
	('00000000-0000-0000-0000-000000000000', '7729bb03-41e3-4bed-bebb-8c8b10c7de89', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 09:50:21.464341+00', ''),
	('00000000-0000-0000-0000-000000000000', '2f947aff-0bc7-43f7-96ec-75709d477304', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 10:11:11.932768+00', ''),
	('00000000-0000-0000-0000-000000000000', '3c0f9673-1cd3-4646-8788-606eaef6bfdc', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 10:11:11.936767+00', ''),
	('00000000-0000-0000-0000-000000000000', '75601c98-5f87-45c4-92d5-8f7929a4d2c1', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 10:18:11.953345+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b64c5a0c-6516-4f2e-9475-d5ee13be3009', '{"action":"login","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 10:19:39.8572+00', ''),
	('00000000-0000-0000-0000-000000000000', '1eb7b96d-5145-48da-889c-65edaf32aba8', '{"action":"logout","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-07 10:19:43.76255+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e5b45c0c-c11c-4153-bf45-432f48a33880', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 10:20:02.738758+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f648680-48b1-4161-946f-b1cbc2c9c951', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 11:21:37.272447+00', ''),
	('00000000-0000-0000-0000-000000000000', '35753eda-c048-438e-b31f-59bbd28c6905', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 11:21:37.275037+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e59758b-3fb1-43a0-8195-f38115fc52b1', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 11:21:39.238353+00', ''),
	('00000000-0000-0000-0000-000000000000', '04002905-4059-4007-8c8d-b35dd4b56aca', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 11:21:39.567984+00', ''),
	('00000000-0000-0000-0000-000000000000', '012fac38-4c13-47e5-b26a-2acde60067ad', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 12:21:59.44224+00', ''),
	('00000000-0000-0000-0000-000000000000', 'caae02f1-78f1-4f64-9198-c576bcdbcd13', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 12:21:59.444834+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b08a1559-ec21-44e2-b5ef-a9939c8d9176', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 12:21:59.460449+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c267d64f-2f1b-4999-8d0a-17422aff5766', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 12:22:03.647195+00', ''),
	('00000000-0000-0000-0000-000000000000', '938bdd77-1c37-4eb6-8c0c-b81d7b730d3d', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 12:22:03.936939+00', ''),
	('00000000-0000-0000-0000-000000000000', '901a11d3-c72b-49d4-a6d5-b9631a679def', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 13:20:30.728854+00', ''),
	('00000000-0000-0000-0000-000000000000', '63cad37d-c499-412b-8262-14dd511f6f28', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 13:20:30.731964+00', ''),
	('00000000-0000-0000-0000-000000000000', '368202b7-184e-4587-b8db-f1fa98b8f1ed', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 16:55:25.614231+00', ''),
	('00000000-0000-0000-0000-000000000000', '55aee7f0-8f47-4721-aaea-8aaa7b1df60f', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 16:55:25.617081+00', ''),
	('00000000-0000-0000-0000-000000000000', '222c2315-15d8-4a01-90d9-a937a51577a3', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 16:55:25.638892+00', ''),
	('00000000-0000-0000-0000-000000000000', '0b587492-4d4a-4dc4-bb0a-2dfa4ab16854', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 16:55:25.658035+00', ''),
	('00000000-0000-0000-0000-000000000000', '9b4347c8-d264-40ad-b93c-fbdb73f57fd4', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 16:56:09.329583+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac2572c1-2dc8-4a2d-9ae6-010f482f5f2e', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 16:57:12.696021+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca23f0a6-d58e-490d-af2a-bdcff884ff97', '{"action":"login","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 17:15:33.383389+00', ''),
	('00000000-0000-0000-0000-000000000000', '786af4ad-3751-4f59-86f1-9ca36ca76a25', '{"action":"logout","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-07 17:15:40.265222+00', ''),
	('00000000-0000-0000-0000-000000000000', '1f17079d-524b-4850-a081-208d1a624697', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 17:15:45.893011+00', ''),
	('00000000-0000-0000-0000-000000000000', '60e905e9-f44a-4950-87fb-e4394d60e741', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 17:17:55.149392+00', ''),
	('00000000-0000-0000-0000-000000000000', '9047bf0e-1ebc-4a48-b84d-c873abb8f1e6', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 17:18:06.552363+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d9f2b7c-78c8-4838-ba49-0be40d147bed', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 17:19:25.48662+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1b080ed-416f-4820-b5b7-de6cf7c0fae2', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 23:40:10.597685+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e55c3e58-38be-4ca9-836c-a11bebf063a8', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 23:40:10.600534+00', ''),
	('00000000-0000-0000-0000-000000000000', '44962cad-b55f-4530-8234-3afa07f13b5a', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-07 23:40:11.395002+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b402660f-c4fb-4329-b207-9a5d8085d48c', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 23:40:12.466225+00', ''),
	('00000000-0000-0000-0000-000000000000', '86619f15-a800-4f63-a5d7-27b818f3c557', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 23:40:19.062533+00', ''),
	('00000000-0000-0000-0000-000000000000', 'cabf8db8-4cbf-48e0-8afb-dfb46a0ef154', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 23:42:36.88075+00', ''),
	('00000000-0000-0000-0000-000000000000', '55e9fafe-bd20-43ac-bb82-fd3d4178bdbb', '{"action":"logout","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account"}', '2024-12-07 23:56:50.174199+00', ''),
	('00000000-0000-0000-0000-000000000000', '9412e5ae-c968-4ea5-a54f-960c58a37ae0', '{"action":"login","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 23:57:07.776285+00', ''),
	('00000000-0000-0000-0000-000000000000', '8a314792-8569-45cc-868d-8a2b949dc2c9', '{"action":"login","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 23:57:18.400377+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac8648f4-d0c2-4ac6-8157-9dddb6ed62e6', '{"action":"login","actor_id":"19f156af-887b-424a-9a23-d7be2551d562","actor_username":"fornia@hanmail.net","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-07 23:57:37.860605+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ec2e5114-fefe-49f7-b153-22a34172fb33', '{"action":"logout","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-08 00:53:15.625629+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d76dec4-bef9-4337-add5-0b2a0d048369', '{"action":"logout","actor_id":"19f156af-887b-424a-9a23-d7be2551d562","actor_username":"fornia@hanmail.net","actor_via_sso":false,"log_type":"account"}', '2024-12-08 00:54:30.654155+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b0555c67-c3b5-4da4-a4f8-c4f4eb468fb2', '{"action":"login","actor_id":"79531851-315d-4015-9b98-b8d6d71cc8d6","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 00:57:05.904363+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b130d183-d48f-4dd9-a65e-0b4df1e0b5c4', '{"action":"login","actor_id":"80eee7f9-8daa-493f-a794-45968643fe8c","actor_username":"ksw@ytmedia.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 00:57:20.643409+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ac45355-1bc9-4fd5-8d4b-feb32ff92836', '{"action":"login","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 00:57:36.614551+00', ''),
	('00000000-0000-0000-0000-000000000000', '4be93ec8-6f43-4e31-88ab-2f47df81f0d4', '{"action":"login","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 00:57:44.604412+00', ''),
	('00000000-0000-0000-0000-000000000000', '7391927d-b97a-45bd-94a5-5792cc03e2bd', '{"action":"login","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 00:57:50.42474+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f30d87f1-729a-42be-b721-c7d001732660', '{"action":"login","actor_id":"19f156af-887b-424a-9a23-d7be2551d562","actor_username":"fornia@hanmail.net","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 00:57:58.856522+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1d40f26-6704-47fb-8d69-40be375f715e', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 01:48:20.152626+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f727ff9a-89ed-4a1d-8ee3-c7b011e0388e', '{"action":"token_refreshed","actor_id":"79531851-315d-4015-9b98-b8d6d71cc8d6","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:55:26.140948+00', ''),
	('00000000-0000-0000-0000-000000000000', '90db966d-cc75-4cf2-8ff1-e81eb89d73bd', '{"action":"token_revoked","actor_id":"79531851-315d-4015-9b98-b8d6d71cc8d6","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:55:26.141988+00', ''),
	('00000000-0000-0000-0000-000000000000', '7bf02b34-fdd9-4063-b95b-26678b1733b3', '{"action":"token_refreshed","actor_id":"80eee7f9-8daa-493f-a794-45968643fe8c","actor_username":"ksw@ytmedia.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:55:27.07808+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bab7ff21-f8b5-40da-b055-ffccf104199f', '{"action":"token_revoked","actor_id":"80eee7f9-8daa-493f-a794-45968643fe8c","actor_username":"ksw@ytmedia.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:55:27.078729+00', ''),
	('00000000-0000-0000-0000-000000000000', '32be7502-f879-426e-a723-2a049eb537d8', '{"action":"token_refreshed","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:55:55.023453+00', ''),
	('00000000-0000-0000-0000-000000000000', '5d5770d9-e448-4384-9af6-e4c824f41a9a', '{"action":"token_revoked","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:55:55.024137+00', ''),
	('00000000-0000-0000-0000-000000000000', '42d69271-66c8-487f-a93a-d058c2a0140c', '{"action":"token_refreshed","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:56:09.371632+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bc44f880-0923-49b8-bfec-4155836c1d1c', '{"action":"token_revoked","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:56:09.372291+00', ''),
	('00000000-0000-0000-0000-000000000000', '760dcee4-cd43-4ba1-b671-781cb0c0fcb5', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:56:21.692755+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a159ddc7-482e-4147-b71d-b1635091ee5c', '{"action":"token_revoked","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:56:21.693445+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e401d61-47e1-4fc3-97b2-e0d4869c07f1', '{"action":"token_refreshed","actor_id":"19f156af-887b-424a-9a23-d7be2551d562","actor_username":"fornia@hanmail.net","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:56:25.928183+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c2f4e44-71ef-4919-9e30-fb8b7af4ea79', '{"action":"token_revoked","actor_id":"19f156af-887b-424a-9a23-d7be2551d562","actor_username":"fornia@hanmail.net","actor_via_sso":false,"log_type":"token"}', '2024-12-08 01:56:25.929963+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8d69b48-0f60-48c2-8385-93df9da1871b', '{"action":"login","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-08 02:01:53.233957+00', ''),
	('00000000-0000-0000-0000-000000000000', '07ec6c9d-8e94-401e-9c03-ba535c96525e', '{"action":"token_refreshed","actor_id":"79531851-315d-4015-9b98-b8d6d71cc8d6","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:53:26.071577+00', ''),
	('00000000-0000-0000-0000-000000000000', '4b8880b8-c517-4e51-bd9d-fa1d5168f602', '{"action":"token_revoked","actor_id":"79531851-315d-4015-9b98-b8d6d71cc8d6","actor_username":"ihkoo@hidayone.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:53:26.072558+00', ''),
	('00000000-0000-0000-0000-000000000000', '0c0f4033-61c1-4c4a-9e53-5ab0e8b3708a', '{"action":"token_refreshed","actor_id":"80eee7f9-8daa-493f-a794-45968643fe8c","actor_username":"ksw@ytmedia.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:53:51.514139+00', ''),
	('00000000-0000-0000-0000-000000000000', '8ed1d704-2df7-43f5-b977-eeadad916cd6', '{"action":"token_revoked","actor_id":"80eee7f9-8daa-493f-a794-45968643fe8c","actor_username":"ksw@ytmedia.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:53:51.514769+00', ''),
	('00000000-0000-0000-0000-000000000000', '4f4aed56-d421-4cc1-905d-98dc88af7b8d', '{"action":"token_refreshed","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:54:09.37565+00', ''),
	('00000000-0000-0000-0000-000000000000', '4bb7b571-420f-4d4b-95f1-8df855e15975', '{"action":"token_revoked","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:54:09.376336+00', ''),
	('00000000-0000-0000-0000-000000000000', '49d7a9e8-f7af-44dc-a1a1-68c26a12e402', '{"action":"token_refreshed","actor_id":"19f156af-887b-424a-9a23-d7be2551d562","actor_username":"fornia@hanmail.net","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:54:26.235129+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e2fde01e-ccc6-4b65-8af2-3562a35a01e1', '{"action":"token_revoked","actor_id":"19f156af-887b-424a-9a23-d7be2551d562","actor_username":"fornia@hanmail.net","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:54:26.235795+00', ''),
	('00000000-0000-0000-0000-000000000000', '43087086-5e6a-4312-b734-ac50a7d4a19e', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:54:45.769769+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ace83d21-ce47-4016-a9c2-c2ad7c2f9d0f', '{"action":"token_revoked","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:54:45.772761+00', ''),
	('00000000-0000-0000-0000-000000000000', '050053eb-395c-4e9a-acd7-c8790703ad99', '{"action":"token_refreshed","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:55:53.313917+00', ''),
	('00000000-0000-0000-0000-000000000000', '2bc7a610-74fc-48f8-85dc-a6b0c358e11a', '{"action":"token_revoked","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 02:55:53.314834+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b6b20bb6-5b7c-40e9-add6-7bf1914a7373', '{"action":"logout","actor_id":"33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1","actor_username":"csy@ynarcher.com","actor_via_sso":false,"log_type":"account"}', '2024-12-08 03:07:49.023588+00', ''),
	('00000000-0000-0000-0000-000000000000', '35c3e912-56d0-4766-88a1-c0910d2448cc', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 03:15:22.892179+00', ''),
	('00000000-0000-0000-0000-000000000000', '604c45e7-dd63-4191-97f4-64a9a8a167b9', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 03:15:22.893219+00', ''),
	('00000000-0000-0000-0000-000000000000', '1d8b3cfe-022c-4ff0-bdf3-5f3492a52273', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 03:45:11.841234+00', ''),
	('00000000-0000-0000-0000-000000000000', '05b91450-082c-492f-a181-fb25f0d7c59e', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 03:45:11.847872+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b9b4faac-4778-4d3b-af3b-07be597b29f5', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 04:20:44.452869+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b39e67fd-62a5-481f-90f9-a4c4bd809812', '{"action":"token_revoked","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-08 04:20:44.456207+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1a5a6df-beb6-45c4-9961-adccc99fb73c', '{"action":"token_refreshed","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 04:48:29.272903+00', ''),
	('00000000-0000-0000-0000-000000000000', '57238db8-ba18-4894-9eca-698d3903adba', '{"action":"token_revoked","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 04:48:29.27456+00', ''),
	('00000000-0000-0000-0000-000000000000', '93be8b65-79cb-40b2-b4b9-9d334cca3545', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 05:56:31.463691+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a22adbc1-62b3-4ea2-ac6f-35ad71d38b73', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 05:56:31.464616+00', ''),
	('00000000-0000-0000-0000-000000000000', '64f4fd39-85a9-4ba7-a696-71b0d95953a7', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 05:56:32.799092+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f6dca351-36e8-4fc1-9958-0d8b68172383', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 05:56:32.799733+00', ''),
	('00000000-0000-0000-0000-000000000000', '3b13d7ab-11c1-4af0-bf65-0ad4e8b1cd60', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 09:22:12.622227+00', ''),
	('00000000-0000-0000-0000-000000000000', '72cffdb8-ce70-4469-a19c-15649f08e18e', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 09:22:12.6303+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f32232c3-bdc7-4ffb-b7fe-9b1f1b4e25f2', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 09:35:48.540728+00', ''),
	('00000000-0000-0000-0000-000000000000', '33cc3000-49dd-4e7a-958e-791675754a8c', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 09:35:48.544662+00', ''),
	('00000000-0000-0000-0000-000000000000', '867744b0-955d-4dd1-840e-f1c8664dd039', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 09:35:49.238192+00', ''),
	('00000000-0000-0000-0000-000000000000', '0e768e4f-0a49-437f-aefb-bcee42c640e3', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 09:35:49.895306+00', ''),
	('00000000-0000-0000-0000-000000000000', '70579558-cd85-4add-a7cb-882eaf4233bd', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 10:37:51.006462+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b8b86400-5106-4b09-b2dd-83f14267895e', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 10:37:51.008623+00', ''),
	('00000000-0000-0000-0000-000000000000', '505a7851-01bd-4950-ab34-248942284c33', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 10:37:51.02612+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd7d00022-db24-4fd1-8d60-efbf90aec720', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 10:37:53.036488+00', ''),
	('00000000-0000-0000-0000-000000000000', '82ca02b3-fe7f-45b6-9951-3e4a2f06fa7a', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 10:37:53.248807+00', ''),
	('00000000-0000-0000-0000-000000000000', '6cfdaaa6-3133-4570-9aed-4fc31c4d0a20', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 11:37:56.44384+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e9bf3a3c-06ac-4385-a60a-a63fe2e39424', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 11:37:56.447294+00', ''),
	('00000000-0000-0000-0000-000000000000', '312aa3f4-572f-4e15-bd86-a1c39040b334', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 11:47:01.149024+00', ''),
	('00000000-0000-0000-0000-000000000000', '58c79825-2268-4895-84e6-6dff08a03cfe', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-08 11:47:01.15102+00', ''),
	('00000000-0000-0000-0000-000000000000', '64c03170-8a3e-44ac-9a4e-f05a73c28369', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-09 13:03:06.614523+00', ''),
	('00000000-0000-0000-0000-000000000000', 'd57715f6-02f8-4679-9d73-c9a030ad8fd9', '{"action":"token_revoked","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-09 13:03:06.630122+00', ''),
	('00000000-0000-0000-0000-000000000000', '06366bee-8b30-4596-bfb3-97742563d672', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-09 13:03:08.320961+00', ''),
	('00000000-0000-0000-0000-000000000000', '3a132e18-31fd-4c0a-8e77-dced1ecacc62', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-09 13:03:08.719937+00', ''),
	('00000000-0000-0000-0000-000000000000', '1512e68e-1e9e-4b33-b34f-b1c9eeec80be', '{"action":"logout","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-09 13:03:26.898584+00', ''),
	('00000000-0000-0000-0000-000000000000', '90192ae5-85aa-491d-9403-360733d5867d', '{"action":"login","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-09 13:03:40.240139+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a54403e2-1d2f-4e45-ac81-a09803d689ae', '{"action":"logout","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account"}', '2024-12-09 13:03:56.205876+00', ''),
	('00000000-0000-0000-0000-000000000000', '98e05e7b-4845-4d0c-b996-83f0b6e2b895', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 07:38:34.057866+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e639fa20-da5f-4236-b471-f3edc179ac6a', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 07:38:34.082389+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c13c1031-61a1-4e23-8521-bc742da37f8b', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 07:38:38.25875+00', ''),
	('00000000-0000-0000-0000-000000000000', '8d3e1687-f9e1-44a2-add0-a1d8901c92e8', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 07:38:38.41743+00', ''),
	('00000000-0000-0000-0000-000000000000', '28a6585b-a491-47fe-a95f-2cb824879cfb', '{"action":"token_refreshed","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 09:09:30.9331+00', ''),
	('00000000-0000-0000-0000-000000000000', 'fe108b70-cf30-491b-9120-e39e02a868c9', '{"action":"token_revoked","actor_id":"e0ad02e0-252e-4829-9272-592819e864dc","actor_username":"sbhan@miraeholding.com","actor_via_sso":false,"log_type":"token"}', '2024-12-10 09:09:30.940796+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c921842d-5e4e-406c-bf58-e9c4c6d8341e', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 06:03:34.305891+00', ''),
	('00000000-0000-0000-0000-000000000000', 'bbcd3825-b502-45e9-b0c4-b2fd9d9a60df', '{"action":"token_revoked","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-12 06:03:34.31968+00', ''),
	('00000000-0000-0000-0000-000000000000', '8f79d9a2-0b10-4560-bbe9-49bcc581cfd0', '{"action":"login","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}', '2024-12-14 14:32:02.453345+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b96d83f0-f775-437b-b542-394f07d107f8', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-15 17:00:57.466808+00', ''),
	('00000000-0000-0000-0000-000000000000', '66b24e24-53bc-4282-9877-b326cd4b30db', '{"action":"token_revoked","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-15 17:00:57.476822+00', ''),
	('00000000-0000-0000-0000-000000000000', '59e2e036-33bd-4434-92a4-3bcb6e8e300e', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-15 17:00:58.55888+00', ''),
	('00000000-0000-0000-0000-000000000000', '23d65f45-3e47-491b-81be-94c338e15294', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-15 17:00:58.57478+00', ''),
	('00000000-0000-0000-0000-000000000000', '905eb715-9890-4a0f-870a-314554271a51', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-17 01:23:27.820086+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca2bfabc-b2bd-40a5-95d6-ddf08f3ea03f', '{"action":"token_revoked","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-17 01:23:27.836088+00', ''),
	('00000000-0000-0000-0000-000000000000', '715761d8-30e7-44d3-a6cf-15b048234b81', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-17 01:23:29.004656+00', ''),
	('00000000-0000-0000-0000-000000000000', '8c9a6078-cde1-4fb4-90e7-78644ba44789', '{"action":"token_refreshed","actor_id":"21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e","actor_username":"1015@handpartners.co.kr","actor_via_sso":false,"log_type":"token"}', '2024-12-17 01:23:29.240674+00', ''),
	('00000000-0000-0000-0000-000000000000', '0580d9ee-6494-4055-8b40-35edf776ede4', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 02:56:25.162711+00', ''),
	('00000000-0000-0000-0000-000000000000', '874eb2e1-20f7-4d90-973a-ec36f87ca06c', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 02:56:26.833002+00', ''),
	('00000000-0000-0000-0000-000000000000', '59ef95f8-dad6-476e-a4dd-93f151425607', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 04:11:12.824113+00', ''),
	('00000000-0000-0000-0000-000000000000', '5252c8be-50f6-4de7-858a-782f7add1af8', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-17 04:11:14.215659+00', ''),
	('00000000-0000-0000-0000-000000000000', '7ec10827-01b4-4e3f-a065-4a1276a93074', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-19 01:10:13.024692+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e84137f-d463-48cb-82c6-69bf4150c592', '{"action":"token_refreshed","actor_id":"b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a","actor_username":"asdf@naver.com","actor_via_sso":false,"log_type":"token"}', '2024-12-20 12:00:19.163538+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '19f156af-887b-424a-9a23-d7be2551d562', 'authenticated', 'authenticated', 'fornia@hanmail.net', '$2a$10$2HQvBmUmpv74DX8W9WUI5ekxrgarhBs9yRdS..S1scJZ9jbxoEOIK', '2024-12-07 04:55:38.722503+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-08 00:57:58.857244+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-12-07 04:55:38.719646+00', '2024-12-08 02:54:26.238116+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'authenticated', 'authenticated', 'csy@ynarcher.com', '$2a$10$IG3ay6IR7nfNfYjg0/lQM.xSodyAuUykxeb6gOc8gbPZ2f.VhixsC', '2024-12-07 04:56:36.774669+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-08 00:57:36.615914+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-12-07 04:56:36.771237+00', '2024-12-08 02:55:53.317326+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'e0ad02e0-252e-4829-9272-592819e864dc', 'authenticated', 'authenticated', 'sbhan@miraeholding.com', '$2a$10$NsLuRoI2xq499o4kcs4mN.iy5sb/nHTO3YAEI6WuU/ZIKM76KszHq', '2024-12-07 04:56:55.850835+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-08 00:57:44.605146+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-12-07 04:56:55.847844+00', '2024-12-10 09:09:30.958704+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', 'authenticated', 'authenticated', 'asdf@naver.com', '$2a$10$V7uP6UuATdIIxKv/0MOTy.x0KkzodHFP52tOGliXwu/g2M/Z0XdTa', '2024-11-30 04:06:55.849243+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-08 02:01:53.236662+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-11-30 04:06:55.843337+00', '2024-12-12 06:03:34.332582+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'f2e0b4a8-5d86-4e09-a72d-24c14cabf091', 'authenticated', 'authenticated', 'jknadan@naver.com', '$2a$10$wEC8xbRsu04R9DXOkN7CFOPX9HnCUdgrcos8nKL6/pT5mhPpiwc/W', '2024-12-07 06:06:36.966097+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-07 06:08:51.02035+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-12-07 06:06:36.959655+00', '2024-12-07 06:08:51.024418+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', 'authenticated', 'authenticated', '1015@handpartners.co.kr', '$2a$10$dIzh8BToDj3hpIntpdOI4.8dX2z4RZSQ9MDPnggAInBeNmSfOfMri', '2024-12-07 04:56:18.678723+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-14 14:32:02.485225+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-12-07 04:56:18.675798+00', '2024-12-17 01:23:27.854031+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '67a09684-3b4a-4d0b-901d-163453460d11', 'authenticated', 'authenticated', 'rkdckdfyyd@naver.com', '$2a$10$BN0/KmNN5Dllw/ukhBLLjOIBt1y.J5zEDDOoMQJ2xBOZsDVjTvsJu', '2024-12-07 05:04:00.532428+00', NULL, '', NULL, '078bc97cf7b81823edb9bfd0954022d3b73792ad929220929419b89d', '2024-12-07 05:04:18.50215+00', '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-12-07 05:04:00.522277+00', '2024-12-07 05:04:18.899784+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '79531851-315d-4015-9b98-b8d6d71cc8d6', 'authenticated', 'authenticated', 'ihkoo@hidayone.com', '$2a$10$z91P5ljw4MxmWERN/ap7UuOmZLlpQ/omETQH.IaB0eNdyG4J9OBIW', '2024-12-07 04:55:57.506995+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-08 00:57:05.905473+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-12-07 04:55:57.504194+00', '2024-12-08 02:53:26.075679+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '80eee7f9-8daa-493f-a794-45968643fe8c', 'authenticated', 'authenticated', 'ksw@ytmedia.co.kr', '$2a$10$yODcrvybz3dDLtn2vhaNGe6croYacx1.mlF6qm8zu1733OZ7wfOzy', '2024-12-07 04:55:14.497795+00', NULL, '', NULL, '', NULL, '', '', NULL, '2024-12-08 00:57:20.644058+00', '{"provider": "email", "providers": ["email"]}', '{}', NULL, '2024-12-07 04:55:14.490102+00', '2024-12-08 02:53:51.516419+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', '{"sub": "b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a", "email": "asdf@naver.com", "email_verified": false, "phone_verified": false}', 'email', '2024-11-30 04:06:55.846169+00', '2024-11-30 04:06:55.846228+00', '2024-11-30 04:06:55.846228+00', '4e7b9408-9e49-4a60-8fad-e35b9d1db228'),
	('80eee7f9-8daa-493f-a794-45968643fe8c', '80eee7f9-8daa-493f-a794-45968643fe8c', '{"sub": "80eee7f9-8daa-493f-a794-45968643fe8c", "email": "ksw@ytmedia.co.kr", "email_verified": false, "phone_verified": false}', 'email', '2024-12-07 04:55:14.493411+00', '2024-12-07 04:55:14.493474+00', '2024-12-07 04:55:14.493474+00', 'cd86a2bb-a82d-46c3-b7ff-025da5e4bf52'),
	('19f156af-887b-424a-9a23-d7be2551d562', '19f156af-887b-424a-9a23-d7be2551d562', '{"sub": "19f156af-887b-424a-9a23-d7be2551d562", "email": "fornia@hanmail.net", "email_verified": false, "phone_verified": false}', 'email', '2024-12-07 04:55:38.720702+00', '2024-12-07 04:55:38.720752+00', '2024-12-07 04:55:38.720752+00', '6a65e99b-5eb0-42ac-9c89-5af55e788ec0'),
	('79531851-315d-4015-9b98-b8d6d71cc8d6', '79531851-315d-4015-9b98-b8d6d71cc8d6', '{"sub": "79531851-315d-4015-9b98-b8d6d71cc8d6", "email": "ihkoo@hidayone.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-07 04:55:57.505282+00', '2024-12-07 04:55:57.505336+00', '2024-12-07 04:55:57.505336+00', '32c32459-38c3-444b-b10f-c2cabeed4591'),
	('21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '{"sub": "21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e", "email": "1015@handpartners.co.kr", "email_verified": false, "phone_verified": false}', 'email', '2024-12-07 04:56:18.676875+00', '2024-12-07 04:56:18.676933+00', '2024-12-07 04:56:18.676933+00', '290abb4f-a042-45b4-9eb8-ede1a620ced2'),
	('33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '{"sub": "33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1", "email": "csy@ynarcher.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-07 04:56:36.772338+00', '2024-12-07 04:56:36.772404+00', '2024-12-07 04:56:36.772404+00', 'fa2fba0b-78c2-46b1-b35d-0070136e52fd'),
	('e0ad02e0-252e-4829-9272-592819e864dc', 'e0ad02e0-252e-4829-9272-592819e864dc', '{"sub": "e0ad02e0-252e-4829-9272-592819e864dc", "email": "sbhan@miraeholding.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-07 04:56:55.848915+00', '2024-12-07 04:56:55.848972+00', '2024-12-07 04:56:55.848972+00', 'f7cb80b3-0c64-43f1-86db-582d837bf2f1'),
	('67a09684-3b4a-4d0b-901d-163453460d11', '67a09684-3b4a-4d0b-901d-163453460d11', '{"sub": "67a09684-3b4a-4d0b-901d-163453460d11", "email": "rkdckdfyyd@naver.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-07 05:04:00.529145+00', '2024-12-07 05:04:00.529221+00', '2024-12-07 05:04:00.529221+00', '27d3ad1a-8f1f-46b5-8d4e-6b3ad987596b'),
	('f2e0b4a8-5d86-4e09-a72d-24c14cabf091', 'f2e0b4a8-5d86-4e09-a72d-24c14cabf091', '{"sub": "f2e0b4a8-5d86-4e09-a72d-24c14cabf091", "email": "jknadan@naver.com", "email_verified": false, "phone_verified": false}', 'email', '2024-12-07 06:06:36.961051+00', '2024-12-07 06:06:36.961101+00', '2024-12-07 06:06:36.961101+00', '04fc5f8d-bd26-43f5-85ce-bba89c78dd1b');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") VALUES
	('8f216dc9-c2ad-4160-8191-c017a0e70641', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '2024-12-14 14:32:02.48535+00', '2024-12-17 01:23:29.242626+00', NULL, 'aal1', NULL, '2024-12-17 01:23:29.242013', 'node', '44.200.140.219', NULL),
	('a3e65f84-3ad4-4209-80f6-cda88cc05082', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', '2024-12-08 02:01:53.236746+00', '2024-12-20 12:00:19.187929+00', NULL, 'aal1', NULL, '2024-12-20 12:00:19.187841', 'node', '44.211.194.205', NULL),
	('f3dde9b0-02ae-4de1-9c2d-956869672c93', '79531851-315d-4015-9b98-b8d6d71cc8d6', '2024-12-08 00:57:05.905562+00', '2024-12-08 02:53:26.077+00', NULL, 'aal1', NULL, '2024-12-08 02:53:26.076923', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '106.101.130.38', NULL),
	('0f11388a-ea7d-4983-8729-8025b371c4b8', '80eee7f9-8daa-493f-a794-45968643fe8c', '2024-12-08 00:57:20.644127+00', '2024-12-08 02:53:51.5174+00', NULL, 'aal1', NULL, '2024-12-08 02:53:51.517329', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Whale/3.28.266.14 Safari/537.36', '118.33.172.25', NULL),
	('c5919759-34c1-4e78-a74b-66d200ed2d8d', '19f156af-887b-424a-9a23-d7be2551d562', '2024-12-08 00:57:58.857316+00', '2024-12-08 02:54:26.23908+00', NULL, 'aal1', NULL, '2024-12-08 02:54:26.239005', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Whale/3.28.266.14 Safari/537.36', '222.101.199.58', NULL),
	('0bb9e751-94c1-401d-8ddb-10b447ba89dd', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', '2024-12-08 01:48:20.154929+00', '2024-12-08 11:37:56.453133+00', NULL, 'aal1', NULL, '2024-12-08 11:37:56.453063', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36', '210.178.239.160', NULL),
	('bd717eef-b7e6-4093-9a12-fb3de884e2d8', 'e0ad02e0-252e-4829-9272-592819e864dc', '2024-12-08 00:57:44.606809+00', '2024-12-10 09:09:30.962334+00', NULL, 'aal1', NULL, '2024-12-10 09:09:30.961761', 'node', '44.200.105.238', NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('f3dde9b0-02ae-4de1-9c2d-956869672c93', '2024-12-08 00:57:05.910339+00', '2024-12-08 00:57:05.910339+00', 'password', 'b30d3167-a3e7-413f-880e-ca698386e5e6'),
	('0f11388a-ea7d-4983-8729-8025b371c4b8', '2024-12-08 00:57:20.646554+00', '2024-12-08 00:57:20.646554+00', 'password', '3d9964c9-5a62-412c-a66b-85416bccc867'),
	('bd717eef-b7e6-4093-9a12-fb3de884e2d8', '2024-12-08 00:57:44.610244+00', '2024-12-08 00:57:44.610244+00', 'password', '93f2a456-4a02-4775-88b9-8c13436067bd'),
	('c5919759-34c1-4e78-a74b-66d200ed2d8d', '2024-12-08 00:57:58.859168+00', '2024-12-08 00:57:58.859168+00', 'password', 'dda7944c-f67e-40a0-a988-0a4a8545669b'),
	('0bb9e751-94c1-401d-8ddb-10b447ba89dd', '2024-12-08 01:48:20.159678+00', '2024-12-08 01:48:20.159678+00', 'password', 'b4f699bd-a7eb-4283-b4f4-99d04d271d53'),
	('a3e65f84-3ad4-4209-80f6-cda88cc05082', '2024-12-08 02:01:53.241589+00', '2024-12-08 02:01:53.241589+00', 'password', '69e8e017-74d4-4cf0-8cd2-eb979342391a'),
	('8f216dc9-c2ad-4160-8191-c017a0e70641', '2024-12-14 14:32:02.531606+00', '2024-12-14 14:32:02.531606+00', 'password', '2b58fd0c-29ac-48ba-8aef-f442125a02d3');


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('bf1ec3ca-76d1-4a5b-8c23-33a4fd7fb59e', '67a09684-3b4a-4d0b-901d-163453460d11', 'recovery_token', '078bc97cf7b81823edb9bfd0954022d3b73792ad929220929419b89d', 'rkdckdfyyd@naver.com', '2024-12-07 05:04:18.901336', '2024-12-07 05:04:18.901336');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 86, 'ippuDGdZCz82a0cx_dOYOA', '19f156af-887b-424a-9a23-d7be2551d562', true, '2024-12-08 01:56:25.930845+00', '2024-12-08 02:54:26.236278+00', 'La-rarExfwFwNt9M0oF6Fg', 'c5919759-34c1-4e78-a74b-66d200ed2d8d'),
	('00000000-0000-0000-0000-000000000000', 91, '5C3_t-F48ZY62zhiFK6beQ', '19f156af-887b-424a-9a23-d7be2551d562', false, '2024-12-08 02:54:26.236659+00', '2024-12-08 02:54:26.236659+00', 'ippuDGdZCz82a0cx_dOYOA', 'c5919759-34c1-4e78-a74b-66d200ed2d8d'),
	('00000000-0000-0000-0000-000000000000', 87, 'ofAHdwUVStSS_DxGXfZCkg', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 02:01:53.238616+00', '2024-12-08 03:15:22.893758+00', NULL, 'a3e65f84-3ad4-4209-80f6-cda88cc05082'),
	('00000000-0000-0000-0000-000000000000', 80, '12iDPBa94Wvozehi6O3V8g', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 01:48:20.156807+00', '2024-12-08 03:45:11.848509+00', NULL, '0bb9e751-94c1-401d-8ddb-10b447ba89dd'),
	('00000000-0000-0000-0000-000000000000', 90, 'FHmjMoEShc_1RegK6yUofA', 'e0ad02e0-252e-4829-9272-592819e864dc', true, '2024-12-08 02:54:09.377166+00', '2024-12-08 04:48:29.27509+00', 'ujLzUHqVRGo2obUpLVTYQw', 'bd717eef-b7e6-4093-9a12-fb3de884e2d8'),
	('00000000-0000-0000-0000-000000000000', 95, 'yVW2DRs_CodDZ1ZiRIdkrg', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 03:45:11.852666+00', '2024-12-08 05:56:31.465153+00', '12iDPBa94Wvozehi6O3V8g', '0bb9e751-94c1-401d-8ddb-10b447ba89dd'),
	('00000000-0000-0000-0000-000000000000', 94, 'UnAi0VkX4fZv4AIvTqu9HQ', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 03:15:22.894454+00', '2024-12-08 05:56:32.800235+00', 'ofAHdwUVStSS_DxGXfZCkg', 'a3e65f84-3ad4-4209-80f6-cda88cc05082'),
	('00000000-0000-0000-0000-000000000000', 98, 'HFdlHmpR3Exo76HsXPaNow', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 05:56:31.466595+00', '2024-12-08 09:22:12.630932+00', 'yVW2DRs_CodDZ1ZiRIdkrg', '0bb9e751-94c1-401d-8ddb-10b447ba89dd'),
	('00000000-0000-0000-0000-000000000000', 99, 'BE7UYCC0Or7zC_huOFMYfg', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 05:56:32.803206+00', '2024-12-08 09:35:48.545316+00', 'UnAi0VkX4fZv4AIvTqu9HQ', 'a3e65f84-3ad4-4209-80f6-cda88cc05082'),
	('00000000-0000-0000-0000-000000000000', 100, '_PXgtIzuXXQSTq6_UnQYng', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 09:22:12.633182+00', '2024-12-08 10:37:51.00932+00', 'HFdlHmpR3Exo76HsXPaNow', '0bb9e751-94c1-401d-8ddb-10b447ba89dd'),
	('00000000-0000-0000-0000-000000000000', 102, 'Wp6zvyEYuWVjwwteqiwyog', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 10:37:51.010721+00', '2024-12-08 11:37:56.448614+00', '_PXgtIzuXXQSTq6_UnQYng', '0bb9e751-94c1-401d-8ddb-10b447ba89dd'),
	('00000000-0000-0000-0000-000000000000', 103, 'Gb4XbMIhxKJOeT4F3rpw_Q', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', false, '2024-12-08 11:37:56.450449+00', '2024-12-08 11:37:56.450449+00', 'Wp6zvyEYuWVjwwteqiwyog', '0bb9e751-94c1-401d-8ddb-10b447ba89dd'),
	('00000000-0000-0000-0000-000000000000', 101, 'oF5pgaQG142l6dPvqcJO-Q', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 09:35:48.547079+00', '2024-12-08 11:47:01.151525+00', 'BE7UYCC0Or7zC_huOFMYfg', 'a3e65f84-3ad4-4209-80f6-cda88cc05082'),
	('00000000-0000-0000-0000-000000000000', 104, '98xEzokSAjeADQukyoy7kw', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-08 11:47:01.153089+00', '2024-12-10 07:38:34.084329+00', 'oF5pgaQG142l6dPvqcJO-Q', 'a3e65f84-3ad4-4209-80f6-cda88cc05082'),
	('00000000-0000-0000-0000-000000000000', 97, 'hR2N8PSCUo6HU7NNXP4tPg', 'e0ad02e0-252e-4829-9272-592819e864dc', true, '2024-12-08 04:48:29.275834+00', '2024-12-10 09:09:30.942052+00', 'FHmjMoEShc_1RegK6yUofA', 'bd717eef-b7e6-4093-9a12-fb3de884e2d8'),
	('00000000-0000-0000-0000-000000000000', 108, 'chZu1jlGCjFLWsQYBUVe-g', 'e0ad02e0-252e-4829-9272-592819e864dc', false, '2024-12-10 09:09:30.951443+00', '2024-12-10 09:09:30.951443+00', 'hR2N8PSCUo6HU7NNXP4tPg', 'bd717eef-b7e6-4093-9a12-fb3de884e2d8'),
	('00000000-0000-0000-0000-000000000000', 107, 'GUc7KaJ9lH0lmOVprJGSnA', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', true, '2024-12-10 07:38:34.09731+00', '2024-12-12 06:03:34.320283+00', '98xEzokSAjeADQukyoy7kw', 'a3e65f84-3ad4-4209-80f6-cda88cc05082'),
	('00000000-0000-0000-0000-000000000000', 109, 'A-Uai-Q9jVXJB_wCFSD1IA', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', false, '2024-12-12 06:03:34.326987+00', '2024-12-12 06:03:34.326987+00', 'GUc7KaJ9lH0lmOVprJGSnA', 'a3e65f84-3ad4-4209-80f6-cda88cc05082'),
	('00000000-0000-0000-0000-000000000000', 110, 'JYjvzSfgYbn4mmuIkgQbdw', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', true, '2024-12-14 14:32:02.502979+00', '2024-12-15 17:00:57.478616+00', NULL, '8f216dc9-c2ad-4160-8191-c017a0e70641'),
	('00000000-0000-0000-0000-000000000000', 111, 'VMaWm4YSMt2veedyUAe9Bw', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', true, '2024-12-15 17:00:57.484977+00', '2024-12-17 01:23:27.837233+00', 'JYjvzSfgYbn4mmuIkgQbdw', '8f216dc9-c2ad-4160-8191-c017a0e70641'),
	('00000000-0000-0000-0000-000000000000', 112, '2cTpr4WA3GmEz27-bL2zkw', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', false, '2024-12-17 01:23:27.8463+00', '2024-12-17 01:23:27.8463+00', 'VMaWm4YSMt2veedyUAe9Bw', '8f216dc9-c2ad-4160-8191-c017a0e70641'),
	('00000000-0000-0000-0000-000000000000', 74, 'D6EBQ8N0AqvAudh2y0tDuw', '79531851-315d-4015-9b98-b8d6d71cc8d6', true, '2024-12-08 00:57:05.907385+00', '2024-12-08 01:55:26.142546+00', NULL, 'f3dde9b0-02ae-4de1-9c2d-956869672c93'),
	('00000000-0000-0000-0000-000000000000', 75, 'LaX2VUJLl4yz8JVIGQYkcg', '80eee7f9-8daa-493f-a794-45968643fe8c', true, '2024-12-08 00:57:20.644852+00', '2024-12-08 01:55:27.079218+00', NULL, '0f11388a-ea7d-4983-8729-8025b371c4b8'),
	('00000000-0000-0000-0000-000000000000', 77, 'JFtwbGwQxT9drenH3mZouw', 'e0ad02e0-252e-4829-9272-592819e864dc', true, '2024-12-08 00:57:44.607711+00', '2024-12-08 01:56:09.372935+00', NULL, 'bd717eef-b7e6-4093-9a12-fb3de884e2d8'),
	('00000000-0000-0000-0000-000000000000', 79, 'La-rarExfwFwNt9M0oF6Fg', '19f156af-887b-424a-9a23-d7be2551d562', true, '2024-12-08 00:57:58.858024+00', '2024-12-08 01:56:25.930491+00', NULL, 'c5919759-34c1-4e78-a74b-66d200ed2d8d'),
	('00000000-0000-0000-0000-000000000000', 81, 'cz6_W7C69BYdzOkA7oc4Vg', '79531851-315d-4015-9b98-b8d6d71cc8d6', true, '2024-12-08 01:55:26.145205+00', '2024-12-08 02:53:26.073056+00', 'D6EBQ8N0AqvAudh2y0tDuw', 'f3dde9b0-02ae-4de1-9c2d-956869672c93'),
	('00000000-0000-0000-0000-000000000000', 88, 'PNhHMXR0bAX82wwde_22bg', '79531851-315d-4015-9b98-b8d6d71cc8d6', false, '2024-12-08 02:53:26.074396+00', '2024-12-08 02:53:26.074396+00', 'cz6_W7C69BYdzOkA7oc4Vg', 'f3dde9b0-02ae-4de1-9c2d-956869672c93'),
	('00000000-0000-0000-0000-000000000000', 82, 'vbGcPpzhxhB16_Qzh5Zg6g', '80eee7f9-8daa-493f-a794-45968643fe8c', true, '2024-12-08 01:55:27.079641+00', '2024-12-08 02:53:51.515261+00', 'LaX2VUJLl4yz8JVIGQYkcg', '0f11388a-ea7d-4983-8729-8025b371c4b8'),
	('00000000-0000-0000-0000-000000000000', 89, 'RQFwlUpC3_Ml5pO7C9mijA', '80eee7f9-8daa-493f-a794-45968643fe8c', false, '2024-12-08 02:53:51.515586+00', '2024-12-08 02:53:51.515586+00', 'vbGcPpzhxhB16_Qzh5Zg6g', '0f11388a-ea7d-4983-8729-8025b371c4b8'),
	('00000000-0000-0000-0000-000000000000', 84, 'ujLzUHqVRGo2obUpLVTYQw', 'e0ad02e0-252e-4829-9272-592819e864dc', true, '2024-12-08 01:56:09.373352+00', '2024-12-08 02:54:09.376831+00', 'JFtwbGwQxT9drenH3mZouw', 'bd717eef-b7e6-4093-9a12-fb3de884e2d8');


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."company" ("id", "name", "description", "created_at") VALUES
	(7, '강수빈', '저탄수화물 고단백 김밥과 샌드위치', '2024-12-06 06:45:45.687875+00'),
	(8, '박서림', 'Ai자동화를 활용한 럭셔리 리조트 스윔웨어의 개발및 글로벌 진출', '2024-12-06 06:45:45.687875+00'),
	(9, '박은희', '교과목을 재미있게 학습하는 보드게임', '2024-12-06 06:45:45.687875+00'),
	(10, '황주미', '한옥스테이', '2024-12-06 06:45:45.687875+00'),
	(11, '양대용', '시설농업에 저렴하게 도입 가능한 농작물 AI 모니터링 서비스', '2024-12-06 06:45:45.687875+00'),
	(12, '이현우', '감성 AI 기반 감성적 • 정량적 사용자 경험 평가 시스템', '2024-12-06 06:45:45.687875+00'),
	(13, '황성준', 'AI 추천 일정 공유 캘린더 앱', '2024-12-06 06:45:45.687875+00'),
	(14, '김진현', '해충 제거를 위한 조명기구', '2024-12-06 06:45:45.687875+00'),
	(15, '강필규', '휴대전화 앱을 활용한 고속도로 작업장 안전관리시스템', '2024-12-06 06:45:45.687875+00'),
	(16, '손지혜', '글로벌 브랜드의 샘플 세일 일정을 실시간 알림으로 제공하는 서비스', '2024-12-06 06:45:45.687875+00'),
	(17, '김영석', '로봇 비전을 위한 데이터 전 주기 가공 및 관리 서비스', '2024-12-06 06:45:45.687875+00'),
	(18, 'HH / 김보현', 'AI 기술이 적용된 공모전 / 대외활동 홍보 사이트', '2024-12-06 06:45:45.687875+00'),
	(19, '천하윤', '창작자와의 작품 공유 및 협업이 가능한  사용자 맞춤형 스토리텔링 게임', '2024-12-06 06:45:45.687875+00'),
	(20, '우성운', '프리랜서 스키 강사 중개 B2B 플랫폼', '2024-12-06 06:45:45.687875+00'),
	(21, '서준', '스토리 IP 거래 오픈마켓 [포도상점]', '2024-12-06 06:45:45.687875+00'),
	(22, '오우승', 'EcoMove', '2024-12-06 06:45:45.687875+00'),
	(23, '손보람', '사진, 동영상, 위치 자동기록 및 공유하는 앱서비스', '2024-12-06 06:45:45.687875+00'),
	(24, '이영환', 'AI기반 외국인 (유학생) 취업 솔루션 외국인 인재 매칭 프로그램', '2024-12-06 06:45:45.687875+00'),
	(25, '최창민', '이음콕 : 자동 OPEN/LOCK 기술 적용된 SELF 교체용 가스밸브', '2024-12-06 06:45:45.687875+00'),
	(26, '나인채', '청각장애인을 위한 상황별 다른 색상기술이 적용된 알림기능의 무드등제품', '2024-12-06 06:45:45.687875+00'),
	(27, '정우성', 'AI 기술이 적용된, 외국인 한국어 학습자를 위한 대화 중심 화상 한국어 학습 플랫폼', '2024-12-06 06:45:45.687875+00'),
	(28, '이민준', 'PT트레이너와 회원들을 위한 찍으면 알려주는 건강영양관리 비서', '2024-12-06 06:45:45.687875+00'),
	(29, '신태영', '종합 스포츠 용품 쇼핑몰', '2024-12-06 06:45:45.687875+00'),
	(30, '에어링/이은채', '인천공항 거점 수요응답형 교통(DRT) 서비스 ‘에어링’', '2024-12-06 06:45:45.687875+00'),
	(31, '에센츠/정재훈', '디스플레이와 향기 분사 기능을 결합한 디바이스', '2024-12-06 06:45:45.687875+00'),
	(32, '유가희', '동물 학대 예방을 위한 동물 관리 시스템', '2024-12-07 23:53:40.181256+00');


--
-- Data for Name: program; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."program" ("id", "name", "description", "start_date", "end_date", "created_at", "categories") VALUES
	(1, '2023 예비창업패키지', '창업진흥원 주관 2023년도 예비창업패키지 프로그램입니다.', '2024-05-30', '2024-12-31', '2024-10-10 07:55:47.139787+00', '{플랫폼,콘텐츠,ESG,AI}'),
	(2, '2023 충남IP콘텐츠 지원사업', '2023년도 충남콘텐츠코리아랩에서 주관하는 콘텐츠 IP 지원사업입니다', '2024-08-11', '2024-11-28', '2024-10-10 07:57:16.117988+00', '{플랫폼,콘텐츠}'),
	(6, '2024 광운대학교 IDEA CRAFT 창업캠프', '2025 예비창업패키지 PSST 작성', '2024-12-06', '2024-12-09', '2024-12-06 05:44:12.677+00', '{}');


--
-- Data for Name: judging_round; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."judging_round" ("id", "program_id", "name", "description", "start_date", "created_at", "end_date") VALUES
	(11, 6, '2025 예비창업패키지 PSST 발표심사', '12월 6일 가평 비전센터에서 진행하는 2025 예비창업패키지 PSST 작성 캠프 3일차 발표평가입니다', '2024-12-07', '2024-12-06 06:25:01.052555+00', '2024-12-09');


--
-- Data for Name: evaluation_criteria; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."evaluation_criteria" ("id", "judging_round_id", "item_name", "points", "created_at", "description") VALUES
	(20, 11, '문제인식', 20, '2024-12-06 06:27:31.836512+00', '제품/서비스의 개발동기, 목적(필요성)'),
	(22, 11, '성장전략', 25, '2024-12-06 06:27:31.836512+00', '자금소요 및 조달계획, 시장진입 및 성과창출 전략'),
	(21, 11, '실현가능성', 35, '2024-12-06 06:27:31.836512+00', '제품/서비스의 개발 방안, 고객 대응방안'),
	(23, 11, '기업 구성', 20, '2024-12-06 06:27:31.836512+00', '팀 역량 및 기술보호 노력');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."user" ("username", "created_at", "updated_at", "email", "role", "affiliation", "position", "phone_number", "id") VALUES
	('정일혁', '2024-12-06 06:59:55.676044+00', NULL, NULL, '심사자', '지브', '대표', NULL, '19f156af-887b-424a-9a23-d7be2551d562'),
	('한성범', '2024-12-06 06:59:55.676044+00', NULL, NULL, '심사자', '미래과학기술지주', '선임심사역', NULL, 'e0ad02e0-252e-4829-9272-592819e864dc'),
	('김상우', '2024-12-06 06:50:59.0985+00', NULL, NULL, '심사자', '와이티미디어', '대표', NULL, '80eee7f9-8daa-493f-a794-45968643fe8c'),
	('최서윤', '2024-12-06 06:59:55.676044+00', NULL, NULL, '심사자', '와이앤아처', '센터장', NULL, '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1'),
	('김민정', '2024-12-06 06:59:55.676044+00', NULL, NULL, '심사자', '핸드파트너스', '대표', NULL, '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e'),
	('구일호', '2024-12-06 06:59:55.676044+00', NULL, NULL, '심사자', '하이데이원', '대표', NULL, '79531851-315d-4015-9b98-b8d6d71cc8d6'),
	('강창룡', '2024-12-06 06:08:48.083816+00', NULL, NULL, '관리자', '공유책장', 'CTO', NULL, 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a');


--
-- Data for Name: evaluation; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."evaluation" ("id", "judging_round_id", "company_id", "evaluation_criterion_id", "grade", "created_at", "status", "user_id", "feedback") VALUES
	(107, 11, 19, 20, 16, '2024-12-08 01:14:52.937+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '아이들의 진로탐색 과정을 게임으로 만들어 흥미도를 높이는 점에서 우수하다고 보이나, 아이들의 지속적인 진로지도와 방향성을 잡아주기 위해 우리가 지속적으로 해야하는 솔루션에 대한 내용에 대한 보완과 마케팅 전략에 대해서 설명하는 것이 필요할 것'),
	(108, 11, 19, 22, 20, '2024-12-08 01:14:52.937+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '아이들의 진로탐색 과정을 게임으로 만들어 흥미도를 높이는 점에서 우수하다고 보이나, 아이들의 지속적인 진로지도와 방향성을 잡아주기 위해 우리가 지속적으로 해야하는 솔루션에 대한 내용에 대한 보완과 마케팅 전략에 대해서 설명하는 것이 필요할 것'),
	(109, 11, 19, 21, 30, '2024-12-08 01:14:52.937+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '아이들의 진로탐색 과정을 게임으로 만들어 흥미도를 높이는 점에서 우수하다고 보이나, 아이들의 지속적인 진로지도와 방향성을 잡아주기 위해 우리가 지속적으로 해야하는 솔루션에 대한 내용에 대한 보완과 마케팅 전략에 대해서 설명하는 것이 필요할 것'),
	(110, 11, 19, 23, 14, '2024-12-08 01:14:52.937+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '아이들의 진로탐색 과정을 게임으로 만들어 흥미도를 높이는 점에서 우수하다고 보이나, 아이들의 지속적인 진로지도와 방향성을 잡아주기 위해 우리가 지속적으로 해야하는 솔루션에 대한 내용에 대한 보완과 마케팅 전략에 대해서 설명하는 것이 필요할 것'),
	(115, 11, 19, 20, 16, '2024-12-08 01:15:09.518+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '구체적인 게임 기획 콘텐츠 및 체험할 수 있는 요소에 대한 방안 마련이 필요.
모바일 게임과 함께 오프라인으로 같이 활용할 수 있는 교구 개발도 검토 필요'),
	(116, 11, 19, 22, 20, '2024-12-08 01:15:09.519+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '구체적인 게임 기획 콘텐츠 및 체험할 수 있는 요소에 대한 방안 마련이 필요.
모바일 게임과 함께 오프라인으로 같이 활용할 수 있는 교구 개발도 검토 필요'),
	(117, 11, 19, 21, 28, '2024-12-08 01:15:09.519+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '구체적인 게임 기획 콘텐츠 및 체험할 수 있는 요소에 대한 방안 마련이 필요.
모바일 게임과 함께 오프라인으로 같이 활용할 수 있는 교구 개발도 검토 필요'),
	(118, 11, 19, 23, 16, '2024-12-08 01:15:09.519+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '구체적인 게임 기획 콘텐츠 및 체험할 수 있는 요소에 대한 방안 마련이 필요.
모바일 게임과 함께 오프라인으로 같이 활용할 수 있는 교구 개발도 검토 필요'),
	(119, 11, 19, 20, 15, '2024-12-08 01:15:30.01+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '진로 탐색 과정을 게임을 통해 학생들에게 서비스를 제공하는 아이템은 시장성이 높다고 판단됩니다.
시장 분석, 마케팅 방안 등을 좀 더 보완하기 바랍니다.'),
	(120, 11, 19, 22, 20, '2024-12-08 01:15:30.011+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '진로 탐색 과정을 게임을 통해 학생들에게 서비스를 제공하는 아이템은 시장성이 높다고 판단됩니다.
시장 분석, 마케팅 방안 등을 좀 더 보완하기 바랍니다.'),
	(121, 11, 19, 21, 30, '2024-12-08 01:15:30.011+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '진로 탐색 과정을 게임을 통해 학생들에게 서비스를 제공하는 아이템은 시장성이 높다고 판단됩니다.
시장 분석, 마케팅 방안 등을 좀 더 보완하기 바랍니다.'),
	(122, 11, 19, 23, 15, '2024-12-08 01:15:30.011+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '진로 탐색 과정을 게임을 통해 학생들에게 서비스를 제공하는 아이템은 시장성이 높다고 판단됩니다.
시장 분석, 마케팅 방안 등을 좀 더 보완하기 바랍니다.'),
	(123, 11, 15, 20, 15, '2024-12-08 01:16:53.392+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'gps 기술 차이 오차 범위 필요.  통제실 통한 통제 보다는 현장에서의 실시간 피드백이 더 효율적으로 보임'),
	(124, 11, 15, 22, 20, '2024-12-08 01:16:53.392+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'gps 기술 차이 오차 범위 필요.  통제실 통한 통제 보다는 현장에서의 실시간 피드백이 더 효율적으로 보임'),
	(125, 11, 15, 21, 25, '2024-12-08 01:16:53.392+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'gps 기술 차이 오차 범위 필요.  통제실 통한 통제 보다는 현장에서의 실시간 피드백이 더 효율적으로 보임'),
	(126, 11, 15, 23, 12, '2024-12-08 01:16:53.392+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'gps 기술 차이 오차 범위 필요.  통제실 통한 통제 보다는 현장에서의 실시간 피드백이 더 효율적으로 보임'),
	(199, 11, 20, 20, 15, '2024-12-08 01:41:02.513+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '계절적 수요에 대한 대응방안 필요'),
	(200, 11, 20, 22, 17, '2024-12-08 01:41:02.513+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '계절적 수요에 대한 대응방안 필요'),
	(201, 11, 20, 21, 30, '2024-12-08 01:41:02.513+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '계절적 수요에 대한 대응방안 필요'),
	(202, 11, 20, 23, 12, '2024-12-08 01:41:02.513+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '계절적 수요에 대한 대응방안 필요'),
	(159, 11, 31, 20, 12, '2024-12-08 01:31:54.221+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '향기 분사에 대한 실제 사업화에서의 예측 가능한 문제점 확인 필요'),
	(160, 11, 31, 22, 18, '2024-12-08 01:31:54.221+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '향기 분사에 대한 실제 사업화에서의 예측 가능한 문제점 확인 필요'),
	(161, 11, 31, 21, 30, '2024-12-08 01:31:54.221+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '향기 분사에 대한 실제 사업화에서의 예측 가능한 문제점 확인 필요'),
	(162, 11, 31, 23, 15, '2024-12-08 01:31:54.221+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '향기 분사에 대한 실제 사업화에서의 예측 가능한 문제점 확인 필요'),
	(208, 11, 29, 22, 15, '2024-12-08 01:44:57.588+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '스포츠용품 대여 과정에서의 세척, 회수 등의 문제 발생에 대한 대안 필요'),
	(209, 11, 29, 21, 35, '2024-12-08 01:44:57.588+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '스포츠용품 대여 과정에서의 세척, 회수 등의 문제 발생에 대한 대안 필요'),
	(133, 11, 15, 21, 29, '2024-12-08 02:06:05.079+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 문제인식에서의 솔루션의 구체성 반영 필요
2. ''25년 매출 달성에서 1월 부터 매출 발생인데 6억이 가능한 부분'),
	(134, 11, 15, 23, 15, '2024-12-08 02:06:05.079+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 문제인식에서의 솔루션의 구체성 반영 필요
2. ''25년 매출 달성에서 1월 부터 매출 발생인데 6억이 가능한 부분'),
	(127, 11, 15, 20, 15, '2024-12-08 01:17:40.514+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '솔루션의  구체적 실현성을 높이는 전략이 좀 더 필요해 보이며  G판매 마케팅(판매) 전략의 고도화를 통해 확장성과 성장성의 확보가 좀 더 필요해 보입니다. 솔루션의 효용성,  효율성에 대한 검증을 통해 기업의 핵심가치를 높일 수 있으리라 생각합니다'),
	(128, 11, 15, 22, 20, '2024-12-08 01:17:40.515+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '솔루션의  구체적 실현성을 높이는 전략이 좀 더 필요해 보이며  G판매 마케팅(판매) 전략의 고도화를 통해 확장성과 성장성의 확보가 좀 더 필요해 보입니다. 솔루션의 효용성,  효율성에 대한 검증을 통해 기업의 핵심가치를 높일 수 있으리라 생각합니다'),
	(129, 11, 15, 21, 25, '2024-12-08 01:17:40.515+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '솔루션의  구체적 실현성을 높이는 전략이 좀 더 필요해 보이며  G판매 마케팅(판매) 전략의 고도화를 통해 확장성과 성장성의 확보가 좀 더 필요해 보입니다. 솔루션의 효용성,  효율성에 대한 검증을 통해 기업의 핵심가치를 높일 수 있으리라 생각합니다'),
	(130, 11, 15, 23, 10, '2024-12-08 01:17:40.515+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '솔루션의  구체적 실현성을 높이는 전략이 좀 더 필요해 보이며  G판매 마케팅(판매) 전략의 고도화를 통해 확장성과 성장성의 확보가 좀 더 필요해 보입니다. 솔루션의 효용성,  효율성에 대한 검증을 통해 기업의 핵심가치를 높일 수 있으리라 생각합니다'),
	(143, 11, 7, 20, 15, '2024-12-08 01:25:01.375+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '실현가능성이 높고 예비 창업가의 역량이 우수한 것이 장점이라고 판단됩니다.
지속적인 사업화를 위한 전략(즉석 식품 유통, 프랜차이즈 전략) 등이 보완이 필요합니다.'),
	(144, 11, 7, 22, 18, '2024-12-08 01:25:01.375+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '실현가능성이 높고 예비 창업가의 역량이 우수한 것이 장점이라고 판단됩니다.
지속적인 사업화를 위한 전략(즉석 식품 유통, 프랜차이즈 전략) 등이 보완이 필요합니다.'),
	(145, 11, 7, 21, 29, '2024-12-08 01:25:01.375+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '실현가능성이 높고 예비 창업가의 역량이 우수한 것이 장점이라고 판단됩니다.
지속적인 사업화를 위한 전략(즉석 식품 유통, 프랜차이즈 전략) 등이 보완이 필요합니다.'),
	(146, 11, 7, 23, 16, '2024-12-08 01:25:01.375+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '실현가능성이 높고 예비 창업가의 역량이 우수한 것이 장점이라고 판단됩니다.
지속적인 사업화를 위한 전략(즉석 식품 유통, 프랜차이즈 전략) 등이 보완이 필요합니다.'),
	(147, 11, 7, 20, 16, '2024-12-08 01:27:43.687+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사업을 시작할때, 사업예산이 중요함. 프랜차이즈 사업, 삼각김밥과 같이 공장에서 공급하는 사업 등을 검토할때 초기 사업 예산이 얼마나 들어가는지 비교 검토해서 선택하는 것도 하나의 방법이 됨'),
	(148, 11, 7, 22, 20, '2024-12-08 01:27:43.687+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사업을 시작할때, 사업예산이 중요함. 프랜차이즈 사업, 삼각김밥과 같이 공장에서 공급하는 사업 등을 검토할때 초기 사업 예산이 얼마나 들어가는지 비교 검토해서 선택하는 것도 하나의 방법이 됨'),
	(149, 11, 7, 21, 30, '2024-12-08 01:27:43.687+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사업을 시작할때, 사업예산이 중요함. 프랜차이즈 사업, 삼각김밥과 같이 공장에서 공급하는 사업 등을 검토할때 초기 사업 예산이 얼마나 들어가는지 비교 검토해서 선택하는 것도 하나의 방법이 됨'),
	(150, 11, 7, 23, 14, '2024-12-08 01:27:43.687+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사업을 시작할때, 사업예산이 중요함. 프랜차이즈 사업, 삼각김밥과 같이 공장에서 공급하는 사업 등을 검토할때 초기 사업 예산이 얼마나 들어가는지 비교 검토해서 선택하는 것도 하나의 방법이 됨'),
	(155, 11, 31, 20, 15, '2024-12-08 02:08:12.008+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 향기 전문가로서 제조의 문제 어떻게 해결 할 것인가

2. 문제인식에서 디스플레이 결합형의 제품을 원하는 지가 명확하지 않음.'),
	(139, 11, 7, 20, 14, '2024-12-08 03:00:01.199+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '첫 페이지에 우리 아이템에 대한 설명이 포함되는 것이 필요하며, 요즘 키토 김밥이 유행하고 있는데 우리가 기존 경쟁자와 다른 우리만의 강점과 차별점이 무엇인지 설명하는 것이 필요함. 또한, 우리가 타겟으로 하는 시장에 대한 설명도 보완하면 좋을 것'),
	(140, 11, 7, 22, 15, '2024-12-08 03:00:01.199+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '첫 페이지에 우리 아이템에 대한 설명이 포함되는 것이 필요하며, 요즘 키토 김밥이 유행하고 있는데 우리가 기존 경쟁자와 다른 우리만의 강점과 차별점이 무엇인지 설명하는 것이 필요함. 또한, 우리가 타겟으로 하는 시장에 대한 설명도 보완하면 좋을 것'),
	(175, 11, 31, 20, 18, '2024-12-08 01:32:57.543+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '디스플레이에 대한  이미지의 개선등을 통해 사업계획서의 설득력을 높이고 팀빌딩 중 대표자에 대한 기술의 고도화를 통해 기업 가치를 부각 시키는 전략이 필요해 보입니다'),
	(176, 11, 31, 22, 18, '2024-12-08 01:32:57.543+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '디스플레이에 대한  이미지의 개선등을 통해 사업계획서의 설득력을 높이고 팀빌딩 중 대표자에 대한 기술의 고도화를 통해 기업 가치를 부각 시키는 전략이 필요해 보입니다'),
	(177, 11, 31, 21, 28, '2024-12-08 01:32:57.543+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '디스플레이에 대한  이미지의 개선등을 통해 사업계획서의 설득력을 높이고 팀빌딩 중 대표자에 대한 기술의 고도화를 통해 기업 가치를 부각 시키는 전략이 필요해 보입니다'),
	(178, 11, 31, 23, 15, '2024-12-08 01:32:57.543+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '디스플레이에 대한  이미지의 개선등을 통해 사업계획서의 설득력을 높이고 팀빌딩 중 대표자에 대한 기술의 고도화를 통해 기업 가치를 부각 시키는 전략이 필요해 보입니다'),
	(179, 11, 14, 20, 15, '2024-12-08 01:35:26.148+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '사업 아이템의 필요성이 우수하고 시제품 제작까지 완료한 상황이라 실현가능성도 높을 것으로 판단됨. 목표 시장의 선정과 분석을 보완하여 그에 적합한 마케팅 전략의 수립도 중요할 것으로 판단됨.'),
	(180, 11, 14, 22, 18, '2024-12-08 01:35:26.148+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '사업 아이템의 필요성이 우수하고 시제품 제작까지 완료한 상황이라 실현가능성도 높을 것으로 판단됨. 목표 시장의 선정과 분석을 보완하여 그에 적합한 마케팅 전략의 수립도 중요할 것으로 판단됨.'),
	(181, 11, 14, 21, 29, '2024-12-08 01:35:26.148+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '사업 아이템의 필요성이 우수하고 시제품 제작까지 완료한 상황이라 실현가능성도 높을 것으로 판단됨. 목표 시장의 선정과 분석을 보완하여 그에 적합한 마케팅 전략의 수립도 중요할 것으로 판단됨.'),
	(182, 11, 14, 23, 15, '2024-12-08 01:35:26.148+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '사업 아이템의 필요성이 우수하고 시제품 제작까지 완료한 상황이라 실현가능성도 높을 것으로 판단됨. 목표 시장의 선정과 분석을 보완하여 그에 적합한 마케팅 전략의 수립도 중요할 것으로 판단됨.'),
	(171, 11, 14, 20, 15, '2024-12-08 01:36:48.744+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템에서 가장 중요한 것은 경쟁자 분석임. 우리가 기존 기술 및 제품과 다른 점이 무엇인지, 우리의 강점과 차별화가 무엇인지에 대한 설명을 통해 우리 제품의 우수성을 설명하는 것이 필요하다고 보임. 또한, 마케팅 전략에 대한 내용 보완이 필요하다고 보임'),
	(172, 11, 14, 22, 17, '2024-12-08 01:36:48.744+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템에서 가장 중요한 것은 경쟁자 분석임. 우리가 기존 기술 및 제품과 다른 점이 무엇인지, 우리의 강점과 차별화가 무엇인지에 대한 설명을 통해 우리 제품의 우수성을 설명하는 것이 필요하다고 보임. 또한, 마케팅 전략에 대한 내용 보완이 필요하다고 보임'),
	(173, 11, 14, 21, 25, '2024-12-08 01:36:48.744+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템에서 가장 중요한 것은 경쟁자 분석임. 우리가 기존 기술 및 제품과 다른 점이 무엇인지, 우리의 강점과 차별화가 무엇인지에 대한 설명을 통해 우리 제품의 우수성을 설명하는 것이 필요하다고 보임. 또한, 마케팅 전략에 대한 내용 보완이 필요하다고 보임'),
	(174, 11, 14, 23, 17, '2024-12-08 01:36:48.744+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템에서 가장 중요한 것은 경쟁자 분석임. 우리가 기존 기술 및 제품과 다른 점이 무엇인지, 우리의 강점과 차별화가 무엇인지에 대한 설명을 통해 우리 제품의 우수성을 설명하는 것이 필요하다고 보임. 또한, 마케팅 전략에 대한 내용 보완이 필요하다고 보임'),
	(187, 11, 14, 20, 18, '2024-12-08 01:37:46.598+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사업에 대한 명확한 소개와 기대효과를 보여줄 필요가 있으며, 실제 필드 테스트를 통해서 성능 및 비용 효과에 대한 데이터가 확보된다면 더욱 경쟁력 있는 사업계획서가 될 것으로 생각함. '),
	(188, 11, 14, 22, 20, '2024-12-08 01:37:46.598+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사업에 대한 명확한 소개와 기대효과를 보여줄 필요가 있으며, 실제 필드 테스트를 통해서 성능 및 비용 효과에 대한 데이터가 확보된다면 더욱 경쟁력 있는 사업계획서가 될 것으로 생각함. '),
	(189, 11, 14, 21, 30, '2024-12-08 01:37:46.598+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사업에 대한 명확한 소개와 기대효과를 보여줄 필요가 있으며, 실제 필드 테스트를 통해서 성능 및 비용 효과에 대한 데이터가 확보된다면 더욱 경쟁력 있는 사업계획서가 될 것으로 생각함. '),
	(190, 11, 14, 23, 16, '2024-12-08 01:37:46.598+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사업에 대한 명확한 소개와 기대효과를 보여줄 필요가 있으며, 실제 필드 테스트를 통해서 성능 및 비용 효과에 대한 데이터가 확보된다면 더욱 경쟁력 있는 사업계획서가 될 것으로 생각함. '),
	(203, 11, 20, 20, 15, '2024-12-08 01:42:22.313+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '계절적 사업 아이템의 문제점, 계획하는 BM 다양성의 고도화를 통해 사업계획서 발표 자료에 기술한다면 좀 더 효율적인 발표 자료와 사업화가 가능 하리라 판단합니다'),
	(207, 11, 29, 20, 10, '2024-12-08 01:44:57.588+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '스포츠용품 대여 과정에서의 세척, 회수 등의 문제 발생에 대한 대안 필요'),
	(204, 11, 20, 22, 20, '2024-12-08 01:42:22.313+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '계절적 사업 아이템의 문제점, 계획하는 BM 다양성의 고도화를 통해 사업계획서 발표 자료에 기술한다면 좀 더 효율적인 발표 자료와 사업화가 가능 하리라 판단합니다'),
	(205, 11, 20, 21, 30, '2024-12-08 01:42:22.313+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '계절적 사업 아이템의 문제점, 계획하는 BM 다양성의 고도화를 통해 사업계획서 발표 자료에 기술한다면 좀 더 효율적인 발표 자료와 사업화가 가능 하리라 판단합니다'),
	(206, 11, 20, 23, 15, '2024-12-08 01:42:22.313+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '계절적 사업 아이템의 문제점, 계획하는 BM 다양성의 고도화를 통해 사업계획서 발표 자료에 기술한다면 좀 더 효율적인 발표 자료와 사업화가 가능 하리라 판단합니다'),
	(210, 11, 29, 23, 12, '2024-12-08 01:44:57.588+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '스포츠용품 대여 과정에서의 세척, 회수 등의 문제 발생에 대한 대안 필요'),
	(211, 11, 32, 20, 16, '2024-12-08 01:45:57.468+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '목표 시장에 대한 분석을 보완할 필요가 있습니다. 기존 유사 경쟁 업체에 대한 매출 자료 등을 참조하여 좀 더 명확한 시장 규모를  파악하고 마케팅 전략을 수립할 필요가 있다고 판단됨 '),
	(212, 11, 32, 22, 15, '2024-12-08 01:45:57.468+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '목표 시장에 대한 분석을 보완할 필요가 있습니다. 기존 유사 경쟁 업체에 대한 매출 자료 등을 참조하여 좀 더 명확한 시장 규모를  파악하고 마케팅 전략을 수립할 필요가 있다고 판단됨 '),
	(213, 11, 32, 21, 24, '2024-12-08 01:45:57.468+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '목표 시장에 대한 분석을 보완할 필요가 있습니다. 기존 유사 경쟁 업체에 대한 매출 자료 등을 참조하여 좀 더 명확한 시장 규모를  파악하고 마케팅 전략을 수립할 필요가 있다고 판단됨 '),
	(214, 11, 32, 23, 15, '2024-12-08 01:45:57.468+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '목표 시장에 대한 분석을 보완할 필요가 있습니다. 기존 유사 경쟁 업체에 대한 매출 자료 등을 참조하여 좀 더 명확한 시장 규모를  파악하고 마케팅 전략을 수립할 필요가 있다고 판단됨 '),
	(219, 11, 32, 20, 18, '2024-12-08 01:46:40.957+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '입양전 데이터와 입양 후 어떤 데이터를 확보할지, 어떤 데이터를 통해서 수익을 낼 것인지, 이에 대한 보완이 필요할 것으로 보임.'),
	(220, 11, 32, 22, 18, '2024-12-08 01:46:40.957+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '입양전 데이터와 입양 후 어떤 데이터를 확보할지, 어떤 데이터를 통해서 수익을 낼 것인지, 이에 대한 보완이 필요할 것으로 보임.'),
	(221, 11, 32, 21, 30, '2024-12-08 01:46:40.957+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '입양전 데이터와 입양 후 어떤 데이터를 확보할지, 어떤 데이터를 통해서 수익을 낼 것인지, 이에 대한 보완이 필요할 것으로 보임.'),
	(222, 11, 32, 23, 16, '2024-12-08 01:46:40.957+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '입양전 데이터와 입양 후 어떤 데이터를 확보할지, 어떤 데이터를 통해서 수익을 낼 것인지, 이에 대한 보완이 필요할 것으로 보임.'),
	(227, 11, 32, 20, 16, '2024-12-08 01:46:58.154+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '비즈니스 모델에서 우리 타겟 고객들이 본 아이템을 바탕으로 실제 매출이 나올 수  있을지에 대한 고민과 맞춤 입양에 대한 데이터 수집, 매칭 방안에 대한 설명이 보완되어서 설명되면 좋을 것'),
	(228, 11, 32, 22, 20, '2024-12-08 01:46:58.154+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '비즈니스 모델에서 우리 타겟 고객들이 본 아이템을 바탕으로 실제 매출이 나올 수  있을지에 대한 고민과 맞춤 입양에 대한 데이터 수집, 매칭 방안에 대한 설명이 보완되어서 설명되면 좋을 것'),
	(229, 11, 32, 21, 28, '2024-12-08 01:46:58.154+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '비즈니스 모델에서 우리 타겟 고객들이 본 아이템을 바탕으로 실제 매출이 나올 수  있을지에 대한 고민과 맞춤 입양에 대한 데이터 수집, 매칭 방안에 대한 설명이 보완되어서 설명되면 좋을 것'),
	(230, 11, 32, 23, 17, '2024-12-08 01:46:58.154+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '비즈니스 모델에서 우리 타겟 고객들이 본 아이템을 바탕으로 실제 매출이 나올 수  있을지에 대한 고민과 맞춤 입양에 대한 데이터 수집, 매칭 방안에 대한 설명이 보완되어서 설명되면 좋을 것'),
	(231, 11, 29, 20, 15, '2024-12-08 01:48:57.842+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '사업의 실현성을 높이기 위해 고객 리서치 및 사업성의 검증, 디테일한 프로세스 수립을 통해 실현, 성장성에 대한 세부 사항 정리가 좀 더 필요해 보입니다'),
	(232, 11, 29, 22, 18, '2024-12-08 01:48:57.842+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '사업의 실현성을 높이기 위해 고객 리서치 및 사업성의 검증, 디테일한 프로세스 수립을 통해 실현, 성장성에 대한 세부 사항 정리가 좀 더 필요해 보입니다'),
	(233, 11, 29, 21, 25, '2024-12-08 01:48:57.842+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '사업의 실현성을 높이기 위해 고객 리서치 및 사업성의 검증, 디테일한 프로세스 수립을 통해 실현, 성장성에 대한 세부 사항 정리가 좀 더 필요해 보입니다'),
	(223, 11, 29, 20, 14, '2024-12-08 02:17:14.108+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 대여 서비스에 많은 인풋 들어가지 않을 것 같은데, 실제로 해야 봐야 할 것 같다.

2. 예비창업패키지 명확한 목표 설정 필요(플랫폼을 할건지, 하드웨어를 중심으로 할 것인지.)'),
	(224, 11, 29, 22, 16, '2024-12-08 02:17:14.108+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 대여 서비스에 많은 인풋 들어가지 않을 것 같은데, 실제로 해야 봐야 할 것 같다.

2. 예비창업패키지 명확한 목표 설정 필요(플랫폼을 할건지, 하드웨어를 중심으로 할 것인지.)'),
	(225, 11, 29, 21, 20, '2024-12-08 02:17:14.108+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 대여 서비스에 많은 인풋 들어가지 않을 것 같은데, 실제로 해야 봐야 할 것 같다.

2. 예비창업패키지 명확한 목표 설정 필요(플랫폼을 할건지, 하드웨어를 중심으로 할 것인지.)'),
	(226, 11, 29, 23, 13, '2024-12-08 02:17:14.108+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 대여 서비스에 많은 인풋 들어가지 않을 것 같은데, 실제로 해야 봐야 할 것 같다.

2. 예비창업패키지 명확한 목표 설정 필요(플랫폼을 할건지, 하드웨어를 중심으로 할 것인지.)'),
	(234, 11, 29, 23, 10, '2024-12-08 01:48:57.842+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '사업의 실현성을 높이기 위해 고객 리서치 및 사업성의 검증, 디테일한 프로세스 수립을 통해 실현, 성장성에 대한 세부 사항 정리가 좀 더 필요해 보입니다'),
	(239, 11, 27, 20, 17, '2024-12-08 01:56:30.247+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템에서 보완이 되면 좋을 것으로 보이는 것은 우리가 사람들의 회화 실력 향상을 위해 처음 우리 서비스를 신청할 때 교육 수준을 파악하고 이에 대한 솔루션을 제공하는 프로세스가 포함되면 좋을 것으로 보이며, 향후 실력 향상을 파악할 수 있는 방안에 대해서도 설명되면 좋은 아이템이 될 수 있을 것. 또한, 우리의 강점이 실제 이 서비스를 했던 경험이 많아 MVP에 대한 내용 설명이 되면 좋을 것'),
	(240, 11, 27, 22, 21, '2024-12-08 01:56:30.248+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템에서 보완이 되면 좋을 것으로 보이는 것은 우리가 사람들의 회화 실력 향상을 위해 처음 우리 서비스를 신청할 때 교육 수준을 파악하고 이에 대한 솔루션을 제공하는 프로세스가 포함되면 좋을 것으로 보이며, 향후 실력 향상을 파악할 수 있는 방안에 대해서도 설명되면 좋은 아이템이 될 수 있을 것. 또한, 우리의 강점이 실제 이 서비스를 했던 경험이 많아 MVP에 대한 내용 설명이 되면 좋을 것'),
	(241, 11, 27, 21, 31, '2024-12-08 01:56:30.248+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템에서 보완이 되면 좋을 것으로 보이는 것은 우리가 사람들의 회화 실력 향상을 위해 처음 우리 서비스를 신청할 때 교육 수준을 파악하고 이에 대한 솔루션을 제공하는 프로세스가 포함되면 좋을 것으로 보이며, 향후 실력 향상을 파악할 수 있는 방안에 대해서도 설명되면 좋은 아이템이 될 수 있을 것. 또한, 우리의 강점이 실제 이 서비스를 했던 경험이 많아 MVP에 대한 내용 설명이 되면 좋을 것'),
	(242, 11, 27, 23, 18, '2024-12-08 01:56:30.248+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템에서 보완이 되면 좋을 것으로 보이는 것은 우리가 사람들의 회화 실력 향상을 위해 처음 우리 서비스를 신청할 때 교육 수준을 파악하고 이에 대한 솔루션을 제공하는 프로세스가 포함되면 좋을 것으로 보이며, 향후 실력 향상을 파악할 수 있는 방안에 대해서도 설명되면 좋은 아이템이 될 수 있을 것. 또한, 우리의 강점이 실제 이 서비스를 했던 경험이 많아 MVP에 대한 내용 설명이 되면 좋을 것'),
	(247, 11, 27, 20, 15, '2024-12-08 01:57:08.155+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '유료 고객을 지속적으로 확보하기 위한 전략이 필요하다고 판단됨. 
운영과 관리, 지속적인 성장을 위한 전략이 보안 된다면 실현 가능성이 더욱 높아질 것으로 예상됨.  '),
	(248, 11, 27, 22, 18, '2024-12-08 01:57:08.155+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '유료 고객을 지속적으로 확보하기 위한 전략이 필요하다고 판단됨. 
운영과 관리, 지속적인 성장을 위한 전략이 보안 된다면 실현 가능성이 더욱 높아질 것으로 예상됨.  '),
	(249, 11, 27, 21, 27, '2024-12-08 01:57:08.155+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '유료 고객을 지속적으로 확보하기 위한 전략이 필요하다고 판단됨. 
운영과 관리, 지속적인 성장을 위한 전략이 보안 된다면 실현 가능성이 더욱 높아질 것으로 예상됨.  '),
	(250, 11, 27, 23, 17, '2024-12-08 01:57:08.155+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '유료 고객을 지속적으로 확보하기 위한 전략이 필요하다고 판단됨. 
운영과 관리, 지속적인 성장을 위한 전략이 보안 된다면 실현 가능성이 더욱 높아질 것으로 예상됨.  '),
	(251, 11, 21, 20, 15, '2024-12-08 01:57:59.904+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '문제 제기의 다양성. 실사례 확보를 통해  사업계획서의 고도화가 좀 더 필요해 보이며 실현성의 구체적 방안을 통해 가치를 증명하는 전략이 필요해 보입니다.'),
	(252, 11, 21, 22, 15, '2024-12-08 01:57:59.904+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '문제 제기의 다양성. 실사례 확보를 통해  사업계획서의 고도화가 좀 더 필요해 보이며 실현성의 구체적 방안을 통해 가치를 증명하는 전략이 필요해 보입니다.'),
	(253, 11, 21, 21, 23, '2024-12-08 01:57:59.904+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '문제 제기의 다양성. 실사례 확보를 통해  사업계획서의 고도화가 좀 더 필요해 보이며 실현성의 구체적 방안을 통해 가치를 증명하는 전략이 필요해 보입니다.'),
	(254, 11, 21, 23, 15, '2024-12-08 01:57:59.904+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '문제 제기의 다양성. 실사례 확보를 통해  사업계획서의 고도화가 좀 더 필요해 보이며 실현성의 구체적 방안을 통해 가치를 증명하는 전략이 필요해 보입니다.'),
	(243, 11, 21, 20, 11, '2024-12-08 02:16:31.25+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 비즈니스에 너무 많은 가정과 기반이 필요
함께 할 수 있는 스타가 있는가? 

2. 투사이드 마켓으로 스토리 IP공급자와 IP 수요자가 모두 필요하다.

'),
	(244, 11, 21, 22, 14, '2024-12-08 02:16:31.25+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 비즈니스에 너무 많은 가정과 기반이 필요
함께 할 수 있는 스타가 있는가? 

2. 투사이드 마켓으로 스토리 IP공급자와 IP 수요자가 모두 필요하다.

'),
	(235, 11, 21, 20, 10, '2024-12-08 01:58:19.339+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'IP 매칭 플랫폼과의 유사성과의 차별성 필요 (웹툰, 온라인 도서 시장 등)
어떤 식으로 플랫폼을 홍보 할 것인가에 대한 전략 필요'),
	(236, 11, 21, 22, 13, '2024-12-08 01:58:19.339+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'IP 매칭 플랫폼과의 유사성과의 차별성 필요 (웹툰, 온라인 도서 시장 등)
어떤 식으로 플랫폼을 홍보 할 것인가에 대한 전략 필요'),
	(237, 11, 21, 21, 25, '2024-12-08 01:58:19.339+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'IP 매칭 플랫폼과의 유사성과의 차별성 필요 (웹툰, 온라인 도서 시장 등)
어떤 식으로 플랫폼을 홍보 할 것인가에 대한 전략 필요'),
	(238, 11, 21, 23, 15, '2024-12-08 01:58:19.339+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'IP 매칭 플랫폼과의 유사성과의 차별성 필요 (웹툰, 온라인 도서 시장 등)
어떤 식으로 플랫폼을 홍보 할 것인가에 대한 전략 필요'),
	(263, 11, 27, 20, 18, '2024-12-08 02:00:20.014+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', 'AI 기반의 언어학습 서비스가 많은 상황에서, 외국인 한국어 학습자기 지속적으로 사용할 수 있는 요소(게이미피케이션, 학습 효과 등)에 대한 지속적인 개발이 필요'),
	(264, 11, 27, 22, 22, '2024-12-08 02:00:20.014+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', 'AI 기반의 언어학습 서비스가 많은 상황에서, 외국인 한국어 학습자기 지속적으로 사용할 수 있는 요소(게이미피케이션, 학습 효과 등)에 대한 지속적인 개발이 필요'),
	(265, 11, 27, 21, 32, '2024-12-08 02:00:20.014+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', 'AI 기반의 언어학습 서비스가 많은 상황에서, 외국인 한국어 학습자기 지속적으로 사용할 수 있는 요소(게이미피케이션, 학습 효과 등)에 대한 지속적인 개발이 필요'),
	(266, 11, 27, 23, 18, '2024-12-08 02:00:20.014+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', 'AI 기반의 언어학습 서비스가 많은 상황에서, 외국인 한국어 학습자기 지속적으로 사용할 수 있는 요소(게이미피케이션, 학습 효과 등)에 대한 지속적인 개발이 필요'),
	(279, 11, 18, 20, 15, '2024-12-08 02:05:11.266+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '기존 서비스와의 차별화 및 신규성을 어필할 요소를 보완할 필요가 있음. 
'),
	(280, 11, 18, 22, 18, '2024-12-08 02:05:11.266+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '기존 서비스와의 차별화 및 신규성을 어필할 요소를 보완할 필요가 있음. 
'),
	(281, 11, 18, 21, 22, '2024-12-08 02:05:11.266+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '기존 서비스와의 차별화 및 신규성을 어필할 요소를 보완할 필요가 있음. 
'),
	(282, 11, 18, 23, 16, '2024-12-08 02:05:11.266+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '기존 서비스와의 차별화 및 신규성을 어필할 요소를 보완할 필요가 있음. 
'),
	(283, 11, 23, 20, 12, '2024-12-08 02:05:14.351+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 문제인식이 크게 문제로 다가 오지 않음

2. 사업화가 가능한지에 대해 실질적인 수행을 통한 데이터 확보 필요.'),
	(284, 11, 23, 22, 15, '2024-12-08 02:05:14.351+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 문제인식이 크게 문제로 다가 오지 않음

2. 사업화가 가능한지에 대해 실질적인 수행을 통한 데이터 확보 필요.'),
	(285, 11, 23, 21, 25, '2024-12-08 02:05:14.351+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 문제인식이 크게 문제로 다가 오지 않음

2. 사업화가 가능한지에 대해 실질적인 수행을 통한 데이터 확보 필요.'),
	(286, 11, 23, 23, 11, '2024-12-08 02:05:14.351+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 문제인식이 크게 문제로 다가 오지 않음

2. 사업화가 가능한지에 대해 실질적인 수행을 통한 데이터 확보 필요.'),
	(131, 11, 15, 20, 15, '2024-12-08 02:06:05.079+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 문제인식에서의 솔루션의 구체성 반영 필요
2. ''25년 매출 달성에서 1월 부터 매출 발생인데 6억이 가능한 부분'),
	(132, 11, 15, 22, 19, '2024-12-08 02:06:05.079+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 문제인식에서의 솔루션의 구체성 반영 필요
2. ''25년 매출 달성에서 1월 부터 매출 발생인데 6억이 가능한 부분'),
	(295, 11, 18, 20, 15, '2024-12-08 02:06:14.353+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '기존 플랫폼과 우리의 차별성에 대해서 설명하는 것이 필요하다고 보이며, 대표자께서 본 아이템과 관련해서 진행했던 경력/이력을 포함하여 설명하면 더욱 효과적인 설명이 될 수 있을 것'),
	(296, 11, 18, 22, 20, '2024-12-08 02:06:14.353+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '기존 플랫폼과 우리의 차별성에 대해서 설명하는 것이 필요하다고 보이며, 대표자께서 본 아이템과 관련해서 진행했던 경력/이력을 포함하여 설명하면 더욱 효과적인 설명이 될 수 있을 것'),
	(297, 11, 18, 21, 29, '2024-12-08 02:06:14.353+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '기존 플랫폼과 우리의 차별성에 대해서 설명하는 것이 필요하다고 보이며, 대표자께서 본 아이템과 관련해서 진행했던 경력/이력을 포함하여 설명하면 더욱 효과적인 설명이 될 수 있을 것'),
	(298, 11, 18, 23, 18, '2024-12-08 02:06:14.353+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '기존 플랫폼과 우리의 차별성에 대해서 설명하는 것이 필요하다고 보이며, 대표자께서 본 아이템과 관련해서 진행했던 경력/이력을 포함하여 설명하면 더욱 효과적인 설명이 될 수 있을 것'),
	(299, 11, 18, 20, 16, '2024-12-08 02:06:52.285+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '문제 제기시, 사용자와 공급자 측면을 구분해서 명확히 제시하는 것도 좋을 것 같음. '),
	(300, 11, 18, 22, 20, '2024-12-08 02:06:52.285+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '문제 제기시, 사용자와 공급자 측면을 구분해서 명확히 제시하는 것도 좋을 것 같음. '),
	(301, 11, 18, 21, 30, '2024-12-08 02:06:52.285+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '문제 제기시, 사용자와 공급자 측면을 구분해서 명확히 제시하는 것도 좋을 것 같음. '),
	(302, 11, 18, 23, 16, '2024-12-08 02:06:52.285+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '문제 제기시, 사용자와 공급자 측면을 구분해서 명확히 제시하는 것도 좋을 것 같음. '),
	(195, 11, 20, 20, 12, '2024-12-08 02:07:27.938+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 숨고 등의 솔루션과 시장에서 차별성 위주의 강조

2. 솔루션 구체화 방안

3. 강습료 16% 수준으로 개발, 마케팅 비용 감당 가능 할 것인가'),
	(196, 11, 20, 22, 16, '2024-12-08 02:07:27.938+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 숨고 등의 솔루션과 시장에서 차별성 위주의 강조

2. 솔루션 구체화 방안

3. 강습료 16% 수준으로 개발, 마케팅 비용 감당 가능 할 것인가'),
	(197, 11, 20, 21, 25, '2024-12-08 02:07:27.938+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 숨고 등의 솔루션과 시장에서 차별성 위주의 강조

2. 솔루션 구체화 방안

3. 강습료 16% 수준으로 개발, 마케팅 비용 감당 가능 할 것인가'),
	(198, 11, 20, 23, 11, '2024-12-08 02:07:27.938+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 숨고 등의 솔루션과 시장에서 차별성 위주의 강조

2. 솔루션 구체화 방안

3. 강습료 16% 수준으로 개발, 마케팅 비용 감당 가능 할 것인가'),
	(156, 11, 31, 22, 18, '2024-12-08 02:08:12.008+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 향기 전문가로서 제조의 문제 어떻게 해결 할 것인가

2. 문제인식에서 디스플레이 결합형의 제품을 원하는 지가 명확하지 않음.'),
	(157, 11, 31, 21, 25, '2024-12-08 02:08:12.008+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 향기 전문가로서 제조의 문제 어떻게 해결 할 것인가

2. 문제인식에서 디스플레이 결합형의 제품을 원하는 지가 명확하지 않음.'),
	(158, 11, 31, 23, 12, '2024-12-08 02:08:12.008+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 향기 전문가로서 제조의 문제 어떻게 해결 할 것인가

2. 문제인식에서 디스플레이 결합형의 제품을 원하는 지가 명확하지 않음.'),
	(275, 11, 23, 20, 10, '2024-12-08 02:07:59.569+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '사진 정리 기술로 데이터 용량 간소화하려고 함. 필요성에 대한 제시 보완 필요'),
	(276, 11, 23, 22, 15, '2024-12-08 02:07:59.569+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '사진 정리 기술로 데이터 용량 간소화하려고 함. 필요성에 대한 제시 보완 필요'),
	(277, 11, 23, 21, 25, '2024-12-08 02:07:59.569+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '사진 정리 기술로 데이터 용량 간소화하려고 함. 필요성에 대한 제시 보완 필요'),
	(278, 11, 23, 23, 12, '2024-12-08 02:07:59.569+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '사진 정리 기술로 데이터 용량 간소화하려고 함. 필요성에 대한 제시 보완 필요'),
	(315, 11, 23, 20, 15, '2024-12-08 02:08:30.255+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '비즈니스 모델의 다양성과 광고  수익 모델의 경쟁사 비교를 통한 수치화 등 구체화를 통해 실현성과 성장성을 높이는 전략이 필요해 보입니다,'),
	(316, 11, 23, 22, 20, '2024-12-08 02:08:30.255+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '비즈니스 모델의 다양성과 광고  수익 모델의 경쟁사 비교를 통한 수치화 등 구체화를 통해 실현성과 성장성을 높이는 전략이 필요해 보입니다,'),
	(317, 11, 23, 21, 27, '2024-12-08 02:08:30.255+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '비즈니스 모델의 다양성과 광고  수익 모델의 경쟁사 비교를 통한 수치화 등 구체화를 통해 실현성과 성장성을 높이는 전략이 필요해 보입니다,'),
	(318, 11, 23, 23, 10, '2024-12-08 02:08:30.255+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '비즈니스 모델의 다양성과 광고  수익 모델의 경쟁사 비교를 통한 수치화 등 구체화를 통해 실현성과 성장성을 높이는 전략이 필요해 보입니다,'),
	(319, 11, 9, 20, 15, '2024-12-08 02:16:58.532+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '학습에 대한 동기부여에는 도움이 될 수 있으나 학습적인 지식 전달에는 한계가 있을 것으로 보임'),
	(320, 11, 9, 22, 15, '2024-12-08 02:16:58.532+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '학습에 대한 동기부여에는 도움이 될 수 있으나 학습적인 지식 전달에는 한계가 있을 것으로 보임'),
	(321, 11, 9, 21, 25, '2024-12-08 02:16:58.532+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '학습에 대한 동기부여에는 도움이 될 수 있으나 학습적인 지식 전달에는 한계가 있을 것으로 보임'),
	(322, 11, 9, 23, 15, '2024-12-08 02:16:58.532+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '학습에 대한 동기부여에는 도움이 될 수 있으나 학습적인 지식 전달에는 한계가 있을 것으로 보임'),
	(327, 11, 30, 20, 18, '2024-12-08 02:14:29.143+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리의 가장 중요한 포인트는 거점을 선택하는 것. 거점을 선택할 때 사람들을 모집하고 탑승할 수 있는 방안이 보완되어 설명하면 설득력을 높일 수 있을 것으로 보이며, 차량과 기사님을 모집할 수 있는 방안이 보완되면 좋은 아이템이 될 수 있을 것으로 보임'),
	(328, 11, 30, 22, 22, '2024-12-08 02:14:29.143+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리의 가장 중요한 포인트는 거점을 선택하는 것. 거점을 선택할 때 사람들을 모집하고 탑승할 수 있는 방안이 보완되어 설명하면 설득력을 높일 수 있을 것으로 보이며, 차량과 기사님을 모집할 수 있는 방안이 보완되면 좋은 아이템이 될 수 있을 것으로 보임'),
	(363, 11, 30, 20, 18, '2024-12-08 02:19:37.365+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '틈새 시장 수요 발굴과 함께 매력적인BM이라고 생각함. '),
	(364, 11, 30, 22, 22, '2024-12-08 02:19:37.365+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '틈새 시장 수요 발굴과 함께 매력적인BM이라고 생각함. '),
	(365, 11, 30, 21, 33, '2024-12-08 02:19:37.365+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '틈새 시장 수요 발굴과 함께 매력적인BM이라고 생각함. '),
	(366, 11, 30, 23, 18, '2024-12-08 02:19:37.365+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '틈새 시장 수요 발굴과 함께 매력적인BM이라고 생각함. '),
	(403, 11, 22, 20, 11, '2024-12-08 02:35:19.459+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 축사에서 전산으로 일지를 쓰는 것이 편할까?
2. 어떤 과정으로 업무가 진행이 되는 것인지에 대한 깊은 고찰이 필요할 것으로 보임.'),
	(404, 11, 22, 22, 18, '2024-12-08 02:35:19.459+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 축사에서 전산으로 일지를 쓰는 것이 편할까?
2. 어떤 과정으로 업무가 진행이 되는 것인지에 대한 깊은 고찰이 필요할 것으로 보임.'),
	(405, 11, 22, 21, 20, '2024-12-08 02:35:19.459+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 축사에서 전산으로 일지를 쓰는 것이 편할까?
2. 어떤 과정으로 업무가 진행이 되는 것인지에 대한 깊은 고찰이 필요할 것으로 보임.'),
	(406, 11, 22, 23, 11, '2024-12-08 02:35:19.459+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 축사에서 전산으로 일지를 쓰는 것이 편할까?
2. 어떤 과정으로 업무가 진행이 되는 것인지에 대한 깊은 고찰이 필요할 것으로 보임.'),
	(433, 11, 11, 21, 30, '2024-12-08 02:38:38.908+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사용자의 도입 부담을 줄여줄 수 있는 요소, 지자체 보조금과 같은 콘텐츠를 확인하여 사용자가 쉽게 도입할 수 있다는 부분을 강조하면 좋을 것 같음. '),
	(434, 11, 11, 23, 18, '2024-12-08 02:38:38.908+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사용자의 도입 부담을 줄여줄 수 있는 요소, 지자체 보조금과 같은 콘텐츠를 확인하여 사용자가 쉽게 도입할 수 있다는 부분을 강조하면 좋을 것 같음. '),
	(442, 11, 24, 23, 10, '2024-12-08 02:44:04.916+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '외국인 채용을 위한 중개서비스 제공, 일반 중개 플랫폼인지 스카우터 기능인지에 대한 구체화 필요'),
	(455, 11, 28, 20, 14, '2024-12-08 02:46:32.719+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', 'PT 트레이너와의 인터랙션 전략, 모집 전략 등에 관한 세부 사항이 보완되어야 할 것으로 판단됨.'),
	(329, 11, 30, 21, 29, '2024-12-08 02:14:29.143+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리의 가장 중요한 포인트는 거점을 선택하는 것. 거점을 선택할 때 사람들을 모집하고 탑승할 수 있는 방안이 보완되어 설명하면 설득력을 높일 수 있을 것으로 보이며, 차량과 기사님을 모집할 수 있는 방안이 보완되면 좋은 아이템이 될 수 있을 것으로 보임'),
	(330, 11, 30, 23, 17, '2024-12-08 02:14:29.143+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리의 가장 중요한 포인트는 거점을 선택하는 것. 거점을 선택할 때 사람들을 모집하고 탑승할 수 있는 방안이 보완되어 설명하면 설득력을 높일 수 있을 것으로 보이며, 차량과 기사님을 모집할 수 있는 방안이 보완되면 좋은 아이템이 될 수 있을 것으로 보임'),
	(339, 11, 9, 20, 12, '2024-12-08 02:15:31.532+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 구체적인 어떤 요소로 ''재미''와 ''학습''을 추구할 것인가에 대한 전체적인 시스템 설명은 필요할 것으로 보임

2. 345% 올려준다. 정재되고 정량화 된 내용 필요.'),
	(340, 11, 9, 22, 13, '2024-12-08 02:15:31.532+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 구체적인 어떤 요소로 ''재미''와 ''학습''을 추구할 것인가에 대한 전체적인 시스템 설명은 필요할 것으로 보임

2. 345% 올려준다. 정재되고 정량화 된 내용 필요.'),
	(341, 11, 9, 21, 27, '2024-12-08 02:15:31.532+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 구체적인 어떤 요소로 ''재미''와 ''학습''을 추구할 것인가에 대한 전체적인 시스템 설명은 필요할 것으로 보임

2. 345% 올려준다. 정재되고 정량화 된 내용 필요.'),
	(342, 11, 9, 23, 13, '2024-12-08 02:15:31.532+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 구체적인 어떤 요소로 ''재미''와 ''학습''을 추구할 것인가에 대한 전체적인 시스템 설명은 필요할 것으로 보임

2. 345% 올려준다. 정재되고 정량화 된 내용 필요.'),
	(343, 11, 30, 20, 17, '2024-12-08 02:15:49.35+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '아이템의 필요성과 배경은 매우 우수한 사업 계획으로 판단됨. 성장 전략과 실현 가능성도 높을 것으로 판단되나 운행 차량 확보에 관한 세부 전략과 법적인 위험 요소에 대한 대응 전략이 필요하다고 판단됨 '),
	(344, 11, 30, 22, 22, '2024-12-08 02:15:49.35+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '아이템의 필요성과 배경은 매우 우수한 사업 계획으로 판단됨. 성장 전략과 실현 가능성도 높을 것으로 판단되나 운행 차량 확보에 관한 세부 전략과 법적인 위험 요소에 대한 대응 전략이 필요하다고 판단됨 '),
	(345, 11, 30, 21, 32, '2024-12-08 02:15:49.35+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '아이템의 필요성과 배경은 매우 우수한 사업 계획으로 판단됨. 성장 전략과 실현 가능성도 높을 것으로 판단되나 운행 차량 확보에 관한 세부 전략과 법적인 위험 요소에 대한 대응 전략이 필요하다고 판단됨 '),
	(346, 11, 30, 23, 15, '2024-12-08 02:15:49.35+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '아이템의 필요성과 배경은 매우 우수한 사업 계획으로 판단됨. 성장 전략과 실현 가능성도 높을 것으로 판단되나 운행 차량 확보에 관한 세부 전략과 법적인 위험 요소에 대한 대응 전략이 필요하다고 판단됨 '),
	(245, 11, 21, 21, 23, '2024-12-08 02:16:31.25+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 비즈니스에 너무 많은 가정과 기반이 필요
함께 할 수 있는 스타가 있는가? 

2. 투사이드 마켓으로 스토리 IP공급자와 IP 수요자가 모두 필요하다.

'),
	(246, 11, 21, 23, 11, '2024-12-08 02:16:31.25+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 비즈니스에 너무 많은 가정과 기반이 필요
함께 할 수 있는 스타가 있는가? 

2. 투사이드 마켓으로 스토리 IP공급자와 IP 수요자가 모두 필요하다.

'),
	(359, 11, 9, 20, 15, '2024-12-08 02:17:48.665+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '타켓고객의 정의에 대한 재설정이 필요해 보이면 실질적인 제품의 구성을 통해 실현성을 높이는 전략이 필요하면 실질적인 POC를 통한 검증도 필요해 보입니다.'),
	(360, 11, 9, 22, 18, '2024-12-08 02:17:48.665+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '타켓고객의 정의에 대한 재설정이 필요해 보이면 실질적인 제품의 구성을 통해 실현성을 높이는 전략이 필요하면 실질적인 POC를 통한 검증도 필요해 보입니다.'),
	(361, 11, 9, 21, 25, '2024-12-08 02:17:48.665+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '타켓고객의 정의에 대한 재설정이 필요해 보이면 실질적인 제품의 구성을 통해 실현성을 높이는 전략이 필요하면 실질적인 POC를 통한 검증도 필요해 보입니다.'),
	(362, 11, 9, 23, 10, '2024-12-08 02:17:48.665+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '타켓고객의 정의에 대한 재설정이 필요해 보이면 실질적인 제품의 구성을 통해 실현성을 높이는 전략이 필요하면 실질적인 POC를 통한 검증도 필요해 보입니다.'),
	(367, 11, 12, 20, 14, '2024-12-08 02:24:18.581+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 개인화된 추천 서비스 일반화 된 개념

2. 무엇을 하려고 하는 것인지. 먼저 설명해야 할 필요성이 있음. 결론 먼저 이야기 해야 함.

3. 필요장비에 웹캠이 필요하다는 것은 큰 단점이 될 것 같음.'),
	(368, 11, 12, 22, 19, '2024-12-08 02:24:18.581+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 개인화된 추천 서비스 일반화 된 개념

2. 무엇을 하려고 하는 것인지. 먼저 설명해야 할 필요성이 있음. 결론 먼저 이야기 해야 함.

3. 필요장비에 웹캠이 필요하다는 것은 큰 단점이 될 것 같음.'),
	(369, 11, 12, 21, 28, '2024-12-08 02:24:18.581+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 개인화된 추천 서비스 일반화 된 개념

2. 무엇을 하려고 하는 것인지. 먼저 설명해야 할 필요성이 있음. 결론 먼저 이야기 해야 함.

3. 필요장비에 웹캠이 필요하다는 것은 큰 단점이 될 것 같음.'),
	(370, 11, 12, 23, 16, '2024-12-08 02:24:18.581+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 개인화된 추천 서비스 일반화 된 개념

2. 무엇을 하려고 하는 것인지. 먼저 설명해야 할 필요성이 있음. 결론 먼저 이야기 해야 함.

3. 필요장비에 웹캠이 필요하다는 것은 큰 단점이 될 것 같음.'),
	(371, 11, 16, 20, 14, '2024-12-08 02:24:37.183+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '시장 검증에 대한 내용을 매우 잘 작성이 되어 있으나, 우리가 이번 예비창업패키지를 통해 만들려고 하는 솔루션에 대한 설명이 빠져있어 우리 아이템에 대한 이해가 어려움이 있어 이에 대한 보완이 필요함. 경쟁사 분석의 내용을 보면 우리의 강점을 알기가 어려워 우리가 가장 잘할 수 있는 분야나 내용을 차별화 하는 것이 필요하다고 보임'),
	(372, 11, 16, 22, 22, '2024-12-08 02:24:37.183+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '시장 검증에 대한 내용을 매우 잘 작성이 되어 있으나, 우리가 이번 예비창업패키지를 통해 만들려고 하는 솔루션에 대한 설명이 빠져있어 우리 아이템에 대한 이해가 어려움이 있어 이에 대한 보완이 필요함. 경쟁사 분석의 내용을 보면 우리의 강점을 알기가 어려워 우리가 가장 잘할 수 있는 분야나 내용을 차별화 하는 것이 필요하다고 보임'),
	(373, 11, 16, 21, 26, '2024-12-08 02:24:37.183+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '시장 검증에 대한 내용을 매우 잘 작성이 되어 있으나, 우리가 이번 예비창업패키지를 통해 만들려고 하는 솔루션에 대한 설명이 빠져있어 우리 아이템에 대한 이해가 어려움이 있어 이에 대한 보완이 필요함. 경쟁사 분석의 내용을 보면 우리의 강점을 알기가 어려워 우리가 가장 잘할 수 있는 분야나 내용을 차별화 하는 것이 필요하다고 보임'),
	(374, 11, 16, 23, 16, '2024-12-08 02:24:37.183+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '시장 검증에 대한 내용을 매우 잘 작성이 되어 있으나, 우리가 이번 예비창업패키지를 통해 만들려고 하는 솔루션에 대한 설명이 빠져있어 우리 아이템에 대한 이해가 어려움이 있어 이에 대한 보완이 필요함. 경쟁사 분석의 내용을 보면 우리의 강점을 알기가 어려워 우리가 가장 잘할 수 있는 분야나 내용을 차별화 하는 것이 필요하다고 보임'),
	(375, 11, 12, 20, 15, '2024-12-08 02:27:37.826+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '감성적 경험에 대한 신뢰적인 데이터 확보 필요. 어느 부분에 활용가능한지 보완 필요'),
	(376, 11, 12, 22, 15, '2024-12-08 02:27:37.826+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '감성적 경험에 대한 신뢰적인 데이터 확보 필요. 어느 부분에 활용가능한지 보완 필요'),
	(377, 11, 12, 21, 20, '2024-12-08 02:27:37.826+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '감성적 경험에 대한 신뢰적인 데이터 확보 필요. 어느 부분에 활용가능한지 보완 필요'),
	(378, 11, 12, 23, 15, '2024-12-08 02:27:37.826+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '감성적 경험에 대한 신뢰적인 데이터 확보 필요. 어느 부분에 활용가능한지 보완 필요'),
	(379, 11, 16, 20, 15, '2024-12-08 02:29:10.725+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '기존 유사 서비스와의 명확한 차별성은 좀 더 보완해야 할 것으로 판단됨.'),
	(380, 11, 16, 22, 18, '2024-12-08 02:29:10.725+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '기존 유사 서비스와의 명확한 차별성은 좀 더 보완해야 할 것으로 판단됨.'),
	(381, 11, 16, 21, 24, '2024-12-08 02:29:10.725+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '기존 유사 서비스와의 명확한 차별성은 좀 더 보완해야 할 것으로 판단됨.'),
	(382, 11, 16, 23, 15, '2024-12-08 02:29:10.725+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '기존 유사 서비스와의 명확한 차별성은 좀 더 보완해야 할 것으로 판단됨.'),
	(383, 11, 16, 20, 16, '2024-12-08 02:29:33.861+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '콘텐츠 능력과 최근 경기 상황을 고려했을때, 소비자 유입과 구매가 일어 날 수 있다고 생각함. 다만, 브랜드 측면에서 정체성을 지켜가는 것이 중요할 것으로 보임. '),
	(384, 11, 16, 22, 22, '2024-12-08 02:29:33.861+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '콘텐츠 능력과 최근 경기 상황을 고려했을때, 소비자 유입과 구매가 일어 날 수 있다고 생각함. 다만, 브랜드 측면에서 정체성을 지켜가는 것이 중요할 것으로 보임. '),
	(385, 11, 16, 21, 32, '2024-12-08 02:29:33.861+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '콘텐츠 능력과 최근 경기 상황을 고려했을때, 소비자 유입과 구매가 일어 날 수 있다고 생각함. 다만, 브랜드 측면에서 정체성을 지켜가는 것이 중요할 것으로 보임. '),
	(386, 11, 16, 23, 18, '2024-12-08 02:29:33.861+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '콘텐츠 능력과 최근 경기 상황을 고려했을때, 소비자 유입과 구매가 일어 날 수 있다고 생각함. 다만, 브랜드 측면에서 정체성을 지켜가는 것이 중요할 것으로 보임. '),
	(387, 11, 10, 20, 0, '2024-12-08 02:29:43.536+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '개인사정으로 인한 발표 불참'),
	(388, 11, 10, 22, 0, '2024-12-08 02:29:43.536+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '개인사정으로 인한 발표 불참'),
	(389, 11, 10, 21, 0, '2024-12-08 02:29:43.536+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '개인사정으로 인한 발표 불참'),
	(390, 11, 10, 23, 0, '2024-12-08 02:29:43.536+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '개인사정으로 인한 발표 불참'),
	(391, 11, 12, 20, 15, '2024-12-08 02:30:16.708+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '감성평가 기술을 통한  성장성을 높이는 전략( 타켓기업의 구체화, BM의 타켓팅)을 통해 서비스의 가치와 필요성을 부각 시킬 수 있으리라 판단합니다'),
	(392, 11, 12, 22, 20, '2024-12-08 02:30:16.708+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '감성평가 기술을 통한  성장성을 높이는 전략( 타켓기업의 구체화, BM의 타켓팅)을 통해 서비스의 가치와 필요성을 부각 시킬 수 있으리라 판단합니다'),
	(393, 11, 12, 21, 30, '2024-12-08 02:30:16.708+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '감성평가 기술을 통한  성장성을 높이는 전략( 타켓기업의 구체화, BM의 타켓팅)을 통해 서비스의 가치와 필요성을 부각 시킬 수 있으리라 판단합니다'),
	(394, 11, 12, 23, 15, '2024-12-08 02:30:16.708+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '감성평가 기술을 통한  성장성을 높이는 전략( 타켓기업의 구체화, BM의 타켓팅)을 통해 서비스의 가치와 필요성을 부각 시킬 수 있으리라 판단합니다'),
	(399, 11, 22, 20, 15, '2024-12-08 02:37:32.161+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '축산일지 인증을 위한 서류전반에 대한 관리 플랫폼이 더 효율적으로 보임'),
	(400, 11, 22, 22, 15, '2024-12-08 02:37:32.161+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '축산일지 인증을 위한 서류전반에 대한 관리 플랫폼이 더 효율적으로 보임'),
	(401, 11, 22, 21, 22, '2024-12-08 02:37:32.161+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '축산일지 인증을 위한 서류전반에 대한 관리 플랫폼이 더 효율적으로 보임'),
	(411, 11, 11, 20, 15, '2024-12-08 02:37:32.296+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템의 제목이 저렴하게 도입이 가능하다고 하는데, 기존 제품과의 비교가 되지 않다보니 어느정도의 경제적 효과가 실현되는지 알 수 어려워 이에 대한 내용 보완이 필요하다고 보이며, 향후 POC 내용이 보완되면 좋을 것.  향후 우리 아이템을 바탕으로 타겟 시장에 대한 내용과 우리 아이템을 바탕으로 확장될 수 있는 비즈니스 모델 설명이 필요할 것'),
	(412, 11, 11, 22, 17, '2024-12-08 02:37:32.296+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템의 제목이 저렴하게 도입이 가능하다고 하는데, 기존 제품과의 비교가 되지 않다보니 어느정도의 경제적 효과가 실현되는지 알 수 어려워 이에 대한 내용 보완이 필요하다고 보이며, 향후 POC 내용이 보완되면 좋을 것.  향후 우리 아이템을 바탕으로 타겟 시장에 대한 내용과 우리 아이템을 바탕으로 확장될 수 있는 비즈니스 모델 설명이 필요할 것'),
	(413, 11, 11, 21, 26, '2024-12-08 02:37:32.296+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템의 제목이 저렴하게 도입이 가능하다고 하는데, 기존 제품과의 비교가 되지 않다보니 어느정도의 경제적 효과가 실현되는지 알 수 어려워 이에 대한 내용 보완이 필요하다고 보이며, 향후 POC 내용이 보완되면 좋을 것.  향후 우리 아이템을 바탕으로 타겟 시장에 대한 내용과 우리 아이템을 바탕으로 확장될 수 있는 비즈니스 모델 설명이 필요할 것'),
	(414, 11, 11, 23, 19, '2024-12-08 02:37:32.296+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '우리 아이템의 제목이 저렴하게 도입이 가능하다고 하는데, 기존 제품과의 비교가 되지 않다보니 어느정도의 경제적 효과가 실현되는지 알 수 어려워 이에 대한 내용 보완이 필요하다고 보이며, 향후 POC 내용이 보완되면 좋을 것.  향후 우리 아이템을 바탕으로 타겟 시장에 대한 내용과 우리 아이템을 바탕으로 확장될 수 있는 비즈니스 모델 설명이 필요할 것'),
	(402, 11, 22, 23, 10, '2024-12-08 02:37:32.161+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '축산일지 인증을 위한 서류전반에 대한 관리 플랫폼이 더 효율적으로 보임'),
	(423, 11, 22, 20, 15, '2024-12-08 02:38:02.919+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '수요 시장에 대한 조사와 수익화 가능성에 대한 평가가 필요해 보이며 이를 통해 콘텐츠의 내용과 방향성에 대한 고민이 좀 더 필요해 보입니다,'),
	(424, 11, 22, 22, 20, '2024-12-08 02:38:02.919+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '수요 시장에 대한 조사와 수익화 가능성에 대한 평가가 필요해 보이며 이를 통해 콘텐츠의 내용과 방향성에 대한 고민이 좀 더 필요해 보입니다,'),
	(425, 11, 22, 21, 23, '2024-12-08 02:38:02.919+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '수요 시장에 대한 조사와 수익화 가능성에 대한 평가가 필요해 보이며 이를 통해 콘텐츠의 내용과 방향성에 대한 고민이 좀 더 필요해 보입니다,'),
	(426, 11, 22, 23, 15, '2024-12-08 02:38:02.919+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '수요 시장에 대한 조사와 수익화 가능성에 대한 평가가 필요해 보이며 이를 통해 콘텐츠의 내용과 방향성에 대한 고민이 좀 더 필요해 보입니다,'),
	(427, 11, 11, 20, 16, '2024-12-08 02:38:14.061+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '계측기 판매, 구독료 등의 수익창출 구조에 대한 근거 및 타당성 검토의 보완이 필요함.
시설농업 시장의 핵심 타겟 시장(농작물의 종류, 지역 등) 검토와 초기 진입 전략이 보완된다면 좀 더 실현가능성이 높아질 것으로 판단됨.'),
	(428, 11, 11, 22, 20, '2024-12-08 02:38:14.061+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '계측기 판매, 구독료 등의 수익창출 구조에 대한 근거 및 타당성 검토의 보완이 필요함.
시설농업 시장의 핵심 타겟 시장(농작물의 종류, 지역 등) 검토와 초기 진입 전략이 보완된다면 좀 더 실현가능성이 높아질 것으로 판단됨.'),
	(429, 11, 11, 21, 26, '2024-12-08 02:38:14.061+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '계측기 판매, 구독료 등의 수익창출 구조에 대한 근거 및 타당성 검토의 보완이 필요함.
시설농업 시장의 핵심 타겟 시장(농작물의 종류, 지역 등) 검토와 초기 진입 전략이 보완된다면 좀 더 실현가능성이 높아질 것으로 판단됨.'),
	(430, 11, 11, 23, 16, '2024-12-08 02:38:14.061+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '계측기 판매, 구독료 등의 수익창출 구조에 대한 근거 및 타당성 검토의 보완이 필요함.
시설농업 시장의 핵심 타겟 시장(농작물의 종류, 지역 등) 검토와 초기 진입 전략이 보완된다면 좀 더 실현가능성이 높아질 것으로 판단됨.'),
	(431, 11, 11, 20, 16, '2024-12-08 02:38:38.908+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사용자의 도입 부담을 줄여줄 수 있는 요소, 지자체 보조금과 같은 콘텐츠를 확인하여 사용자가 쉽게 도입할 수 있다는 부분을 강조하면 좋을 것 같음. '),
	(432, 11, 11, 22, 20, '2024-12-08 02:38:38.908+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '사용자의 도입 부담을 줄여줄 수 있는 요소, 지자체 보조금과 같은 콘텐츠를 확인하여 사용자가 쉽게 도입할 수 있다는 부분을 강조하면 좋을 것 같음. '),
	(439, 11, 24, 20, 15, '2024-12-08 02:44:04.916+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '외국인 채용을 위한 중개서비스 제공, 일반 중개 플랫폼인지 스카우터 기능인지에 대한 구체화 필요'),
	(440, 11, 24, 22, 15, '2024-12-08 02:44:04.916+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '외국인 채용을 위한 중개서비스 제공, 일반 중개 플랫폼인지 스카우터 기능인지에 대한 구체화 필요'),
	(441, 11, 24, 21, 20, '2024-12-08 02:44:04.916+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '외국인 채용을 위한 중개서비스 제공, 일반 중개 플랫폼인지 스카우터 기능인지에 대한 구체화 필요'),
	(451, 11, 24, 20, 14, '2024-12-08 02:46:16.854+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 플랫폼이 있으면 해결이 되는데, AI가 어떠한 측면에서 어떻게 작용을 하는지 모르겠음.

2. 20% 정도 개발 완료에 대한 부분의 구체적인 설명이 필요'),
	(452, 11, 24, 22, 25, '2024-12-08 02:46:16.854+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 플랫폼이 있으면 해결이 되는데, AI가 어떠한 측면에서 어떻게 작용을 하는지 모르겠음.

2. 20% 정도 개발 완료에 대한 부분의 구체적인 설명이 필요'),
	(453, 11, 24, 21, 25, '2024-12-08 02:46:16.854+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 플랫폼이 있으면 해결이 되는데, AI가 어떠한 측면에서 어떻게 작용을 하는지 모르겠음.

2. 20% 정도 개발 완료에 대한 부분의 구체적인 설명이 필요'),
	(454, 11, 24, 23, 12, '2024-12-08 02:46:16.854+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 플랫폼이 있으면 해결이 되는데, AI가 어떠한 측면에서 어떻게 작용을 하는지 모르겠음.

2. 20% 정도 개발 완료에 대한 부분의 구체적인 설명이 필요'),
	(456, 11, 28, 22, 18, '2024-12-08 02:46:32.719+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', 'PT 트레이너와의 인터랙션 전략, 모집 전략 등에 관한 세부 사항이 보완되어야 할 것으로 판단됨.'),
	(457, 11, 28, 21, 26, '2024-12-08 02:46:32.719+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', 'PT 트레이너와의 인터랙션 전략, 모집 전략 등에 관한 세부 사항이 보완되어야 할 것으로 판단됨.'),
	(458, 11, 28, 23, 15, '2024-12-08 02:46:32.719+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', 'PT 트레이너와의 인터랙션 전략, 모집 전략 등에 관한 세부 사항이 보완되어야 할 것으로 판단됨.'),
	(435, 11, 24, 20, 10, '2024-12-08 02:47:14.39+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '기업의 핵심 가치에 대한 고민이 필요해 보이며 핵심 가치 역량 강화를 통해 경쟁 우위와 성장성 확장이 필요해 보입니다.'),
	(436, 11, 24, 22, 20, '2024-12-08 02:47:14.39+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '기업의 핵심 가치에 대한 고민이 필요해 보이며 핵심 가치 역량 강화를 통해 경쟁 우위와 성장성 확장이 필요해 보입니다.'),
	(437, 11, 24, 21, 27, '2024-12-08 02:47:14.39+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '기업의 핵심 가치에 대한 고민이 필요해 보이며 핵심 가치 역량 강화를 통해 경쟁 우위와 성장성 확장이 필요해 보입니다.'),
	(438, 11, 24, 23, 15, '2024-12-08 02:47:14.39+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '기업의 핵심 가치에 대한 고민이 필요해 보이며 핵심 가치 역량 강화를 통해 경쟁 우위와 성장성 확장이 필요해 보입니다.'),
	(463, 11, 28, 20, 16, '2024-12-08 02:48:15.796+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '음식과 운동이 자연스럽게 연결될 수 있도록 스토리 관점에서 콘텐츠 재구성이 필요해 보임. '),
	(464, 11, 28, 22, 20, '2024-12-08 02:48:15.796+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '음식과 운동이 자연스럽게 연결될 수 있도록 스토리 관점에서 콘텐츠 재구성이 필요해 보임. '),
	(465, 11, 28, 21, 30, '2024-12-08 02:48:15.796+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '음식과 운동이 자연스럽게 연결될 수 있도록 스토리 관점에서 콘텐츠 재구성이 필요해 보임. '),
	(466, 11, 28, 23, 16, '2024-12-08 02:48:15.796+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '음식과 운동이 자연스럽게 연결될 수 있도록 스토리 관점에서 콘텐츠 재구성이 필요해 보임. '),
	(467, 11, 28, 20, 18, '2024-12-08 02:49:07.837+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '분석되는 알고리즘에 대한 기술적 한계가 존재하는데 우리가 이것을 보완할 수 있는 방안에 대한 설명과 우리의 컨셉이 PT에 초점이 되어 있는지, 건강관리에 초점이 맞춘 것인지에 대한 방향 설정이 분명하게 제시되어야 할 것'),
	(468, 11, 28, 22, 23, '2024-12-08 02:49:07.837+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '분석되는 알고리즘에 대한 기술적 한계가 존재하는데 우리가 이것을 보완할 수 있는 방안에 대한 설명과 우리의 컨셉이 PT에 초점이 되어 있는지, 건강관리에 초점이 맞춘 것인지에 대한 방향 설정이 분명하게 제시되어야 할 것'),
	(469, 11, 28, 21, 33, '2024-12-08 02:49:07.837+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '분석되는 알고리즘에 대한 기술적 한계가 존재하는데 우리가 이것을 보완할 수 있는 방안에 대한 설명과 우리의 컨셉이 PT에 초점이 되어 있는지, 건강관리에 초점이 맞춘 것인지에 대한 방향 설정이 분명하게 제시되어야 할 것'),
	(470, 11, 28, 23, 18, '2024-12-08 02:49:07.837+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '분석되는 알고리즘에 대한 기술적 한계가 존재하는데 우리가 이것을 보완할 수 있는 방안에 대한 설명과 우리의 컨셉이 PT에 초점이 되어 있는지, 건강관리에 초점이 맞춘 것인지에 대한 방향 설정이 분명하게 제시되어야 할 것'),
	(475, 11, 13, 20, 12, '2024-12-08 02:55:33.641+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 경쟁이 너무 치열한 영역에서 과연 어떻게 살아 남을 수 있을 것인가.

2. 개발 이후 마케팅에 대해서 CAC, LTV 등 비용 구조에 대해서 명확하고 창의적인 방안이 필요해 보임'),
	(476, 11, 13, 22, 16, '2024-12-08 02:55:33.641+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 경쟁이 너무 치열한 영역에서 과연 어떻게 살아 남을 수 있을 것인가.

2. 개발 이후 마케팅에 대해서 CAC, LTV 등 비용 구조에 대해서 명확하고 창의적인 방안이 필요해 보임'),
	(477, 11, 13, 21, 21, '2024-12-08 02:55:33.641+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 경쟁이 너무 치열한 영역에서 과연 어떻게 살아 남을 수 있을 것인가.

2. 개발 이후 마케팅에 대해서 CAC, LTV 등 비용 구조에 대해서 명확하고 창의적인 방안이 필요해 보임'),
	(478, 11, 13, 23, 13, '2024-12-08 02:55:33.641+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 경쟁이 너무 치열한 영역에서 과연 어떻게 살아 남을 수 있을 것인가.

2. 개발 이후 마케팅에 대해서 CAC, LTV 등 비용 구조에 대해서 명확하고 창의적인 방안이 필요해 보임'),
	(479, 11, 8, 20, 16, '2024-12-08 02:59:00.913+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '하이엔드 시장을 초점을 맞추는데, 가격적인 면에서는 생각보다 저렴한 편이라서 우리만의 마케팅 전략이 포함되어야 할 것
우리가 타겟하는 시장에 맞춘 우리만의 브랜딩 전략과 제품 컨셉에 대한 설명이 보완되어 설명되면 효과적일 것'),
	(483, 11, 13, 20, 13, '2024-12-08 02:56:40.533+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '유사 서비스와의 차별화가 필요해 보이며 설득에 필요한 자료의 객관화를 통해 서비스의 핵심과 가치의 부각이 필요해 보입니다'),
	(484, 11, 13, 22, 20, '2024-12-08 02:56:40.533+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '유사 서비스와의 차별화가 필요해 보이며 설득에 필요한 자료의 객관화를 통해 서비스의 핵심과 가치의 부각이 필요해 보입니다'),
	(485, 11, 13, 21, 25, '2024-12-08 02:56:40.533+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '유사 서비스와의 차별화가 필요해 보이며 설득에 필요한 자료의 객관화를 통해 서비스의 핵심과 가치의 부각이 필요해 보입니다'),
	(486, 11, 13, 23, 15, '2024-12-08 02:56:40.533+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '유사 서비스와의 차별화가 필요해 보이며 설득에 필요한 자료의 객관화를 통해 서비스의 핵심과 가치의 부각이 필요해 보입니다'),
	(491, 11, 13, 20, 10, '2024-12-08 02:56:53.6+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '시장에서 사용하고 있는 서비스에서 사람들이 반드시 이 서비스를 사용해야 하는 매력요소 어필이 필요함'),
	(492, 11, 13, 22, 15, '2024-12-08 02:56:53.6+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '시장에서 사용하고 있는 서비스에서 사람들이 반드시 이 서비스를 사용해야 하는 매력요소 어필이 필요함'),
	(493, 11, 13, 21, 25, '2024-12-08 02:56:53.6+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '시장에서 사용하고 있는 서비스에서 사람들이 반드시 이 서비스를 사용해야 하는 매력요소 어필이 필요함'),
	(494, 11, 13, 23, 10, '2024-12-08 02:56:53.6+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '시장에서 사용하고 있는 서비스에서 사람들이 반드시 이 서비스를 사용해야 하는 매력요소 어필이 필요함'),
	(480, 11, 8, 22, 16, '2024-12-08 02:59:00.913+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '하이엔드 시장을 초점을 맞추는데, 가격적인 면에서는 생각보다 저렴한 편이라서 우리만의 마케팅 전략이 포함되어야 할 것
우리가 타겟하는 시장에 맞춘 우리만의 브랜딩 전략과 제품 컨셉에 대한 설명이 보완되어 설명되면 효과적일 것'),
	(481, 11, 8, 21, 22, '2024-12-08 02:59:00.913+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '하이엔드 시장을 초점을 맞추는데, 가격적인 면에서는 생각보다 저렴한 편이라서 우리만의 마케팅 전략이 포함되어야 할 것
우리가 타겟하는 시장에 맞춘 우리만의 브랜딩 전략과 제품 컨셉에 대한 설명이 보완되어 설명되면 효과적일 것'),
	(482, 11, 8, 23, 18, '2024-12-08 02:59:00.913+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '하이엔드 시장을 초점을 맞추는데, 가격적인 면에서는 생각보다 저렴한 편이라서 우리만의 마케팅 전략이 포함되어야 할 것
우리가 타겟하는 시장에 맞춘 우리만의 브랜딩 전략과 제품 컨셉에 대한 설명이 보완되어 설명되면 효과적일 것'),
	(141, 11, 7, 21, 25, '2024-12-08 03:00:01.199+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '첫 페이지에 우리 아이템에 대한 설명이 포함되는 것이 필요하며, 요즘 키토 김밥이 유행하고 있는데 우리가 기존 경쟁자와 다른 우리만의 강점과 차별점이 무엇인지 설명하는 것이 필요함. 또한, 우리가 타겟으로 하는 시장에 대한 설명도 보완하면 좋을 것'),
	(142, 11, 7, 23, 19, '2024-12-08 03:00:01.199+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '첫 페이지에 우리 아이템에 대한 설명이 포함되는 것이 필요하며, 요즘 키토 김밥이 유행하고 있는데 우리가 기존 경쟁자와 다른 우리만의 강점과 차별점이 무엇인지 설명하는 것이 필요함. 또한, 우리가 타겟으로 하는 시장에 대한 설명도 보완하면 좋을 것'),
	(507, 11, 8, 20, 15, '2024-12-08 03:01:01.156+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '브랜드 홍보를 위한 전략, 럭셔리 브랜드를 위한 홍보 전략 등이 보완되어야 할 것으로 판단됨.'),
	(508, 11, 8, 22, 20, '2024-12-08 03:01:01.156+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '브랜드 홍보를 위한 전략, 럭셔리 브랜드를 위한 홍보 전략 등이 보완되어야 할 것으로 판단됨.'),
	(509, 11, 8, 21, 25, '2024-12-08 03:01:01.156+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '브랜드 홍보를 위한 전략, 럭셔리 브랜드를 위한 홍보 전략 등이 보완되어야 할 것으로 판단됨.'),
	(510, 11, 8, 23, 10, '2024-12-08 03:01:01.156+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '브랜드 홍보를 위한 전략, 럭셔리 브랜드를 위한 홍보 전략 등이 보완되어야 할 것으로 판단됨.'),
	(511, 11, 25, 20, 12, '2024-12-08 03:04:50.603+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '개인이 설치 가능한가에 대한 안정성. 위험성 리스크는 어느정도 되는가'),
	(512, 11, 25, 22, 18, '2024-12-08 03:04:50.603+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '개인이 설치 가능한가에 대한 안정성. 위험성 리스크는 어느정도 되는가'),
	(513, 11, 25, 21, 25, '2024-12-08 03:04:50.603+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '개인이 설치 가능한가에 대한 안정성. 위험성 리스크는 어느정도 되는가'),
	(514, 11, 25, 23, 15, '2024-12-08 03:04:50.603+00', 'DONE', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', '개인이 설치 가능한가에 대한 안정성. 위험성 리스크는 어느정도 되는가'),
	(515, 11, 17, 20, 19, '2024-12-08 03:08:14.981+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '대표자께서 생각하시는 솔루션에 방식이 표현되지 않아서 솔루션에 대한 설명이 필요하며, 우리 회사의 성장방향에서의 설명이 보완되면 좋을 것'),
	(516, 11, 17, 22, 15, '2024-12-08 03:08:14.981+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '대표자께서 생각하시는 솔루션에 방식이 표현되지 않아서 솔루션에 대한 설명이 필요하며, 우리 회사의 성장방향에서의 설명이 보완되면 좋을 것'),
	(517, 11, 17, 21, 22, '2024-12-08 03:08:14.981+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '대표자께서 생각하시는 솔루션에 방식이 표현되지 않아서 솔루션에 대한 설명이 필요하며, 우리 회사의 성장방향에서의 설명이 보완되면 좋을 것'),
	(518, 11, 17, 23, 17, '2024-12-08 03:08:14.981+00', 'DONE', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', '대표자께서 생각하시는 솔루션에 방식이 표현되지 않아서 솔루션에 대한 설명이 필요하며, 우리 회사의 성장방향에서의 설명이 보완되면 좋을 것'),
	(535, 11, 25, 20, 14, '2024-12-08 03:06:22.5+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 이사비용이 가스 비용에 녹여 있다. (몇 퍼센트 정도 되는가?)

2. 도시가스 조정 비용이 얼마나 될 것인가 구체성 갖춰야 함.

3. 개인이 안 잠그고 이사를 갈 경우 어떻게 진행 되는지

4. 지재권을 통해 아이디어 보호 노력 갖춰야 할 필요성.'),
	(536, 11, 25, 22, 19, '2024-12-08 03:06:22.5+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 이사비용이 가스 비용에 녹여 있다. (몇 퍼센트 정도 되는가?)

2. 도시가스 조정 비용이 얼마나 될 것인가 구체성 갖춰야 함.

3. 개인이 안 잠그고 이사를 갈 경우 어떻게 진행 되는지

4. 지재권을 통해 아이디어 보호 노력 갖춰야 할 필요성.'),
	(537, 11, 25, 21, 23, '2024-12-08 03:06:22.5+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 이사비용이 가스 비용에 녹여 있다. (몇 퍼센트 정도 되는가?)

2. 도시가스 조정 비용이 얼마나 될 것인가 구체성 갖춰야 함.

3. 개인이 안 잠그고 이사를 갈 경우 어떻게 진행 되는지

4. 지재권을 통해 아이디어 보호 노력 갖춰야 할 필요성.'),
	(538, 11, 25, 23, 15, '2024-12-08 03:06:22.5+00', 'DONE', 'e0ad02e0-252e-4829-9272-592819e864dc', '1. 이사비용이 가스 비용에 녹여 있다. (몇 퍼센트 정도 되는가?)

2. 도시가스 조정 비용이 얼마나 될 것인가 구체성 갖춰야 함.

3. 개인이 안 잠그고 이사를 갈 경우 어떻게 진행 되는지

4. 지재권을 통해 아이디어 보호 노력 갖춰야 할 필요성.'),
	(539, 11, 25, 20, 15, '2024-12-08 03:07:16.791+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '제조가 제도를 바꾸는 사례 중심의 실현성을 높이는 전략과 국내 시장의 한계를 수출로 전환하는 전략에 관한 가능성을 높이는 전략이 필요해 보입니다.'),
	(540, 11, 25, 22, 20, '2024-12-08 03:07:16.791+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '제조가 제도를 바꾸는 사례 중심의 실현성을 높이는 전략과 국내 시장의 한계를 수출로 전환하는 전략에 관한 가능성을 높이는 전략이 필요해 보입니다.'),
	(541, 11, 25, 21, 25, '2024-12-08 03:07:16.791+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '제조가 제도를 바꾸는 사례 중심의 실현성을 높이는 전략과 국내 시장의 한계를 수출로 전환하는 전략에 관한 가능성을 높이는 전략이 필요해 보입니다.'),
	(542, 11, 25, 23, 16, '2024-12-08 03:07:16.791+00', 'DONE', '19f156af-887b-424a-9a23-d7be2551d562', '제조가 제도를 바꾸는 사례 중심의 실현성을 높이는 전략과 국내 시장의 한계를 수출로 전환하는 전략에 관한 가능성을 높이는 전략이 필요해 보입니다.'),
	(547, 11, 8, 20, 16, '2024-12-08 03:09:56.06+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '품질과 디자인 역량을 기반으로 사업을 잘 추진하고 있음. 지속적인 브랜딩 강화와 충성 고객 확보를 통한 브랜드 전략이  보완되면 좋을 것 같음.'),
	(548, 11, 8, 22, 22, '2024-12-08 03:09:56.06+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '품질과 디자인 역량을 기반으로 사업을 잘 추진하고 있음. 지속적인 브랜딩 강화와 충성 고객 확보를 통한 브랜드 전략이  보완되면 좋을 것 같음.'),
	(549, 11, 8, 21, 30, '2024-12-08 03:09:56.06+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '품질과 디자인 역량을 기반으로 사업을 잘 추진하고 있음. 지속적인 브랜딩 강화와 충성 고객 확보를 통한 브랜드 전략이  보완되면 좋을 것 같음.'),
	(550, 11, 8, 23, 18, '2024-12-08 03:09:56.06+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '품질과 디자인 역량을 기반으로 사업을 잘 추진하고 있음. 지속적인 브랜딩 강화와 충성 고객 확보를 통한 브랜드 전략이  보완되면 좋을 것 같음.'),
	(551, 11, 17, 20, 18, '2024-12-08 03:10:55.47+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '실제 사업의 진척도를 보여 줄 수 있는 콘텐츠가 마련되면 좋을 것 같음.'),
	(552, 11, 17, 22, 20, '2024-12-08 03:10:55.47+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '실제 사업의 진척도를 보여 줄 수 있는 콘텐츠가 마련되면 좋을 것 같음.'),
	(553, 11, 17, 21, 28, '2024-12-08 03:10:55.47+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '실제 사업의 진척도를 보여 줄 수 있는 콘텐츠가 마련되면 좋을 것 같음.'),
	(554, 11, 17, 23, 16, '2024-12-08 03:10:55.47+00', 'DONE', '79531851-315d-4015-9b98-b8d6d71cc8d6', '실제 사업의 진척도를 보여 줄 수 있는 콘텐츠가 마련되면 좋을 것 같음.'),
	(555, 11, 17, 20, 15, '2024-12-08 03:15:54.204+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '계획하고 있는 기술 개발의 수준과 진행 상황은 우수하다고 판단됨.
1차 목표 시장, 2차 목표 시장의 명확한 규정이 필요하다고 판단됨.'),
	(556, 11, 17, 22, 18, '2024-12-08 03:15:54.204+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '계획하고 있는 기술 개발의 수준과 진행 상황은 우수하다고 판단됨.
1차 목표 시장, 2차 목표 시장의 명확한 규정이 필요하다고 판단됨.'),
	(557, 11, 17, 21, 28, '2024-12-08 03:15:54.204+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '계획하고 있는 기술 개발의 수준과 진행 상황은 우수하다고 판단됨.
1차 목표 시장, 2차 목표 시장의 명확한 규정이 필요하다고 판단됨.'),
	(558, 11, 17, 23, 16, '2024-12-08 03:15:54.204+00', 'DONE', '80eee7f9-8daa-493f-a794-45968643fe8c', '계획하고 있는 기술 개발의 수준과 진행 상황은 우수하다고 판단됨.
1차 목표 시장, 2차 목표 시장의 명확한 규정이 필요하다고 판단됨.');


--
-- Data for Name: judging_round_company; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."judging_round_company" ("id", "company_id", "judging_round_id", "created_at", "pdf_path", "category", "judge_num", "feedback", "group_name") VALUES
	(31, 20, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_usungwoon.pdf?t=2024-12-08T00%3A49%3A32.943Z', NULL, NULL, NULL, 'A'),
	(30, 19, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_chunhayoon.pdf?t=2024-12-08T00%3A49%3A54.745Z', NULL, NULL, NULL, 'B'),
	(38, 27, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_junwoosung.pdf?t=2024-12-08T00%3A50%3A08.036Z', NULL, NULL, NULL, 'B'),
	(29, 18, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_kimbohyun.pdf?t=2024-12-08T00%3A50%3A30.618Z', NULL, NULL, NULL, 'B'),
	(25, 14, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_kimjinhyun.pdf?t=2024-12-08T00%3A50%3A43.739Z', NULL, NULL, NULL, 'B'),
	(21, 10, 11, '2024-12-06 06:54:44.882478+00', '', NULL, NULL, NULL, 'B'),
	(28, 17, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_kimyungsuk.pdf?t=2024-12-08T00%3A50%3A56.070Z', NULL, NULL, NULL, 'B'),
	(41, 30, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_leeeunchae.pdf?t=2024-12-08T00%3A51%3A06.407Z', NULL, NULL, NULL, 'B'),
	(39, 28, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_leeminjun.pdf?t=2024-12-08T00%3A51%3A23.902Z', NULL, NULL, NULL, 'B'),
	(27, 16, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_sonjihye.pdf?t=2024-12-08T00%3A51%3A49.112Z', NULL, NULL, NULL, 'B'),
	(22, 11, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_yangdeyong.pdf?t=2024-12-08T00%3A52%3A06.182Z', NULL, NULL, NULL, 'B'),
	(42, 31, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_jungjehun.pdf', NULL, NULL, NULL, 'A'),
	(34, 23, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_sonboram.pdf?t=2024-12-08T00%3A49%3A21.992Z', NULL, NULL, NULL, 'A'),
	(36, 25, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_choichangmin.pdf', NULL, NULL, NULL, 'A'),
	(24, 13, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_hwangsungjun.pdf', NULL, NULL, NULL, 'A'),
	(26, 15, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_kangpilgyu.pdf?t=2024-12-08T00%3A47%3A53.517Z', NULL, NULL, NULL, 'A'),
	(23, 12, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_leehyunwoo.pdf?t=2024-12-08T00%3A48%3A05.627Z', NULL, NULL, NULL, 'A'),
	(35, 24, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_leeyounghwan.pdf?t=2024-12-08T00%3A48%3A20.284Z', NULL, NULL, NULL, 'A'),
	(33, 22, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_ouseong.pdf?t=2024-12-08T00%3A48%3A35.750Z', NULL, NULL, NULL, 'A'),
	(20, 9, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_parkeunhee.pdf?t=2024-12-08T00%3A48%3A48.766Z', NULL, NULL, NULL, 'A'),
	(32, 21, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_seojun.pdf?t=2024-12-08T00%3A48%3A58.319Z', NULL, NULL, NULL, 'A'),
	(40, 29, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/a_sinteyong.pdf?t=2024-12-08T00%3A49%3A08.851Z', NULL, NULL, NULL, 'A'),
	(19, 8, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_parksurim.pdf?t=2024-12-08T00%3A51%3A39.321Z', NULL, NULL, 'asdf', 'B'),
	(43, 32, 11, '2024-12-07 23:54:40.729935+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_ugahee.pdf?t=2024-12-08T00%3A51%3A57.376Z', NULL, NULL, NULL, 'B'),
	(18, 7, 11, '2024-12-06 06:54:44.882478+00', 'https://sxoubewcczvrahedcuql.supabase.co/storage/v1/object/public/test/ideacraft/b_kangsubin.pdf?t=2024-12-08T00%3A50%3A16.582Z', NULL, NULL, 'sadfsdfdsf', 'B');


--
-- Data for Name: judging_round_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."judging_round_user" ("id", "judging_round_id", "created_at", "user_id", "group_name") VALUES
	(15, 11, '2024-12-06 06:37:37.364729+00', 'b3c7d9cf-65bb-4afe-bd1c-3ddc1e87ee2a', 'A'),
	(22, 11, '2024-12-07 23:55:34.706992+00', '33e6dd26-8a1b-49b1-86ff-41a1f8cf97a1', 'A'),
	(24, 11, '2024-12-07 23:55:34.706992+00', '80eee7f9-8daa-493f-a794-45968643fe8c', 'B'),
	(20, 11, '2024-12-07 23:55:34.706992+00', '19f156af-887b-424a-9a23-d7be2551d562', 'A'),
	(21, 11, '2024-12-07 23:55:34.706992+00', '21fc0fbc-dc63-4883-a5b6-9b1f900b8b3e', 'B'),
	(25, 11, '2024-12-07 23:55:34.706992+00', 'e0ad02e0-252e-4829-9272-592819e864dc', 'A'),
	(23, 11, '2024-12-07 23:55:34.706992+00', '79531851-315d-4015-9b98-b8d6d71cc8d6', 'B');


--
-- Data for Name: program_company; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") VALUES
	('handpartners', 'handpartners', NULL, '2024-12-08 00:19:37.024526+00', '2024-12-08 00:19:37.024526+00', true, false, NULL, NULL, NULL);


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--

INSERT INTO "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") VALUES
	('66a1b3b5-5721-4e4d-9971-4c5d2ff267a4', 'handpartners', 'ideacraft/.emptyFolderPlaceholder', NULL, '2024-12-08 00:19:59.806245+00', '2024-12-08 00:20:32.27018+00', '2024-12-08 00:19:59.806245+00', '{"eTag": "\"d41d8cd98f00b204e9800998ecf8427e\"", "size": 0, "mimetype": "application/octet-stream", "cacheControl": "max-age=3600", "lastModified": "2024-12-08T00:20:33.000Z", "contentLength": 0, "httpStatusCode": 200}', '8bc596e4-f9d3-4fd9-9f6f-7ec95d3d0b5d', NULL, '{}');


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 112, true);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."company_id_seq"', 32, true);


--
-- Name: evaluation_criteria_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."evaluation_criteria_id_seq"', 23, true);


--
-- Name: evaluation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."evaluation_id_seq"', 574, true);


--
-- Name: judging_round_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."judging_round_company_id_seq"', 43, true);


--
-- Name: judging_round_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."judging_round_id_seq"', 11, true);


--
-- Name: judging_round_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."judging_round_user_id_seq"', 25, true);


--
-- Name: program_company_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."program_company_id_seq"', 8, true);


--
-- Name: program_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('"public"."program_id_seq"', 6, true);


--
-- PostgreSQL database dump complete
--

RESET ALL;
