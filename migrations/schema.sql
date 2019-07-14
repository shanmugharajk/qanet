--
-- PostgreSQL database dump
--

-- Dumped from database version 10.5
-- Dumped by pg_dump version 10.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
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


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: answer_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answer_comments (
    id bigint NOT NULL,
    comment text NOT NULL,
    author_id character varying(50) NOT NULL,
    answer_id bigint NOT NULL,
    close_votes integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    deactivated_by character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.answer_comments OWNER TO postgres;

--
-- Name: answer_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.answer_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.answer_comments_id_seq OWNER TO postgres;

--
-- Name: answer_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.answer_comments_id_seq OWNED BY public.answer_comments.id;


--
-- Name: answers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.answers (
    id bigint NOT NULL,
    answer_content text NOT NULL,
    votes integer DEFAULT 0 NOT NULL,
    close_votes integer DEFAULT 0 NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_accepted boolean DEFAULT false NOT NULL,
    author character varying(50) NOT NULL,
    created_by character varying(50) NOT NULL,
    deactivated_by character varying(50) DEFAULT NULL::character varying,
    updated_by character varying(50) NOT NULL,
    question_id bigint NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.answers OWNER TO postgres;

--
-- Name: answers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.answers_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.answers_id_seq OWNER TO postgres;

--
-- Name: answers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.answers_id_seq OWNED BY public.answers.id;


--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookmarks (
    user_id character varying(50) NOT NULL,
    question_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.bookmarks OWNER TO postgres;

--
-- Name: question_comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.question_comments (
    id bigint NOT NULL,
    comment text NOT NULL,
    author_id character varying(50) NOT NULL,
    question_id bigint NOT NULL,
    close_votes integer DEFAULT 0 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    deactivated_by character varying(50),
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.question_comments OWNER TO postgres;

--
-- Name: question_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.question_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.question_comments_id_seq OWNER TO postgres;

--
-- Name: question_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.question_comments_id_seq OWNED BY public.question_comments.id;


--
-- Name: question_tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.question_tags (
    question_id bigint NOT NULL,
    tag_id character varying(50) NOT NULL
);


ALTER TABLE public.question_tags OWNER TO postgres;

--
-- Name: questions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.questions (
    id bigint NOT NULL,
    title character varying(255) NOT NULL,
    title_search tsvector,
    question_content text NOT NULL,
    bookmarks integer DEFAULT 0 NOT NULL,
    votes integer DEFAULT 0 NOT NULL,
    close_votes integer DEFAULT 0 NOT NULL,
    bounty_points integer DEFAULT 0 NOT NULL,
    bounty_expiry_date date NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    is_closed boolean DEFAULT false NOT NULL,
    is_reopen_requested boolean DEFAULT false NOT NULL,
    deactivated_by character varying(50) DEFAULT NULL::character varying,
    author character varying(50) NOT NULL,
    updated_by character varying(50) NOT NULL,
    created_by character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.questions OWNER TO postgres;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.questions_id_seq OWNER TO postgres;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.questions_id_seq OWNED BY public.questions.id;


--
-- Name: schema_migration; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schema_migration (
    version character varying(14) NOT NULL
);


ALTER TABLE public.schema_migration OWNER TO postgres;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id character varying(50) NOT NULL,
    description character varying(500) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    created_by character varying(50) NOT NULL,
    updated_by character varying(50) NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id character varying(50) NOT NULL,
    display_name character varying(200) NOT NULL,
    about character varying(1000) NOT NULL,
    points bigint DEFAULT '1'::bigint,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    role_id character varying(50) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_logged_in timestamp without time zone DEFAULT now() NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: voters_list; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.voters_list (
    id bigint NOT NULL,
    voter_id character varying(50) NOT NULL,
    vote integer NOT NULL,
    question_id bigint,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.voters_list OWNER TO postgres;

--
-- Name: answer_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_comments ALTER COLUMN id SET DEFAULT nextval('public.answer_comments_id_seq'::regclass);


--
-- Name: answers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers ALTER COLUMN id SET DEFAULT nextval('public.answers_id_seq'::regclass);


--
-- Name: question_comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_comments ALTER COLUMN id SET DEFAULT nextval('public.question_comments_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions ALTER COLUMN id SET DEFAULT nextval('public.questions_id_seq'::regclass);


--
-- Name: answer_comments answer_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_comments
    ADD CONSTRAINT answer_comments_pkey PRIMARY KEY (id);


--
-- Name: answers answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (user_id, question_id);


--
-- Name: question_comments question_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_comments
    ADD CONSTRAINT question_comments_pkey PRIMARY KEY (id);


--
-- Name: question_tags question_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_tags
    ADD CONSTRAINT question_tags_pkey PRIMARY KEY (question_id, tag_id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: voters_list voters_list_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voters_list
    ADD CONSTRAINT voters_list_pkey PRIMARY KEY (id, voter_id);


--
-- Name: idx_fts_search; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fts_search ON public.questions USING gin (title_search);


--
-- Name: schema_migration_version_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX schema_migration_version_idx ON public.schema_migration USING btree (version);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: answer_comments answer_comments_answer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_comments
    ADD CONSTRAINT answer_comments_answer_id_fkey FOREIGN KEY (answer_id) REFERENCES public.answers(id) ON DELETE CASCADE;


--
-- Name: answer_comments answer_comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_comments
    ADD CONSTRAINT answer_comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: answer_comments answer_comments_deactivated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answer_comments
    ADD CONSTRAINT answer_comments_deactivated_by_fkey FOREIGN KEY (deactivated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: answers answers_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_author_fkey FOREIGN KEY (author) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: answers answers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: answers answers_deactivated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_deactivated_by_fkey FOREIGN KEY (deactivated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: answers answers_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: answers answers_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.answers
    ADD CONSTRAINT answers_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: bookmarks bookmarks_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: question_comments question_comments_author_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_comments
    ADD CONSTRAINT question_comments_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: question_comments question_comments_deactivated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_comments
    ADD CONSTRAINT question_comments_deactivated_by_fkey FOREIGN KEY (deactivated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: question_comments question_comments_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_comments
    ADD CONSTRAINT question_comments_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: question_tags question_tags_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_tags
    ADD CONSTRAINT question_tags_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: question_tags question_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.question_tags
    ADD CONSTRAINT question_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE RESTRICT;


--
-- Name: questions questions_author_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_author_fkey FOREIGN KEY (author) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: questions questions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: questions questions_deactivated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_deactivated_by_fkey FOREIGN KEY (deactivated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: questions questions_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.questions
    ADD CONSTRAINT questions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: tags tags_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: tags tags_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.user_roles(id) ON DELETE RESTRICT;


--
-- Name: voters_list voters_list_question_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voters_list
    ADD CONSTRAINT voters_list_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id) ON DELETE CASCADE;


--
-- Name: voters_list voters_list_voter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.voters_list
    ADD CONSTRAINT voters_list_voter_id_fkey FOREIGN KEY (voter_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

