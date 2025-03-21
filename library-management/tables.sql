CREATE TABLE IF NOT EXISTS public.books
(
    id bigint NOT NULL DEFAULT nextval('books_id_seq'::regclass),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    isbn text COLLATE pg_catalog."default" NOT NULL,
    title text COLLATE pg_catalog."default" NOT NULL,
    authors text COLLATE pg_catalog."default",
    publisher text COLLATE pg_catalog."default",
    version text COLLATE pg_catalog."default",
    total_copies bigint,
    available_copies bigint,
    library_id bigint,
    CONSTRAINT books_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.books
    OWNER to postgres;
-- Index: idx_books_deleted_at

-- DROP INDEX IF EXISTS public.idx_books_deleted_at;

CREATE INDEX IF NOT EXISTS idx_books_deleted_at
    ON public.books USING btree
    (deleted_at ASC NULLS LAST)
    TABLESPACE pg_default;
-- Index: idx_books_library_id

-- DROP INDEX IF EXISTS public.idx_books_library_id;

CREATE INDEX IF NOT EXISTS idx_books_library_id
    ON public.books USING btree
    (library_id ASC NULLS LAST)
    TABLESPACE pg_default;


----------------------------------------------------------------------------------------

    CREATE TABLE IF NOT EXISTS public.issue_registries
(
    id bigint NOT NULL DEFAULT nextval('issue_registries_id_seq'::regclass),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    isbn text COLLATE pg_catalog."default" NOT NULL,
    reader_id bigint NOT NULL,
    issue_approver_id bigint NOT NULL,
    issue_status character varying(50) COLLATE pg_catalog."default" NOT NULL,
    issue_date bigint NOT NULL,
    expected_return_date bigint NOT NULL,
    return_date bigint DEFAULT 0,
    return_approver_id bigint DEFAULT 0,
    CONSTRAINT issue_registries_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.issue_registries
    OWNER to postgres;
-- Index: idx_issue_registries_deleted_at

-- DROP INDEX IF EXISTS public.idx_issue_registries_deleted_at;

CREATE INDEX IF NOT EXISTS idx_issue_registries_deleted_at
    ON public.issue_registries USING btree
    (deleted_at ASC NULLS LAST)
    TABLESPACE pg_default;

------------------------------------------------------------------------------

    CREATE TABLE IF NOT EXISTS public.libraries
(
    id bigint NOT NULL DEFAULT nextval('libraries_id_seq'::regclass),
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT libraries_pkey PRIMARY KEY (id),
    CONSTRAINT uni_libraries_name UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.libraries
    OWNER to postgres;

-------------------------------------------------------------------------------

   CREATE TABLE IF NOT EXISTS public.request_events
(
    id bigint NOT NULL DEFAULT nextval('request_events_id_seq'::regclass),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    book_id text COLLATE pg_catalog."default" NOT NULL,
    library_id bigint NOT NULL,
    reader_id bigint NOT NULL,
    request_date bigint NOT NULL,
    approval_date bigint,
    approver_id bigint,
    request_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT request_events_pkey PRIMARY KEY (id),
    CONSTRAINT chk_request_events_request_type CHECK (request_type::text = ANY (ARRAY['issue'::character varying, 'return'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.request_events
    OWNER to postgres;
-- Index: idx_request_events_deleted_at

-- DROP INDEX IF EXISTS public.idx_request_events_deleted_at;

CREATE INDEX IF NOT EXISTS idx_request_events_deleted_at
    ON public.request_events USING btree
    (deleted_at ASC NULLS LAST)
    TABLESPACE pg_default;

-------------------------------------------------------------------------------

    CREATE TABLE IF NOT EXISTS public.user_libraries
(
    user_id bigint NOT NULL,
    library_id bigint NOT NULL,
    CONSTRAINT user_libraries_pkey PRIMARY KEY (user_id, library_id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.user_libraries
    OWNER to postgres;


-------------------------------------------------------------------------------------

    CREATE TABLE IF NOT EXISTS public.users
(
    id bigint NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone,
    name text COLLATE pg_catalog."default" NOT NULL,
    email text COLLATE pg_catalog."default" NOT NULL,
    contact text COLLATE pg_catalog."default",
    role character varying(50) COLLATE pg_catalog."default",
    password text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT uni_users_email UNIQUE (email),
    CONSTRAINT chk_users_role CHECK (role::text = ANY (ARRAY['owner'::character varying, 'admin'::character varying, 'user'::character varying]::text[]))
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.users
    OWNER to postgres;
-- Index: idx_users_deleted_at

-- DROP INDEX IF EXISTS public.idx_users_deleted_at;

CREATE INDEX IF NOT EXISTS idx_users_deleted_at
    ON public.users USING btree
    (deleted_at ASC NULLS LAST)
    TABLESPACE pg_default;