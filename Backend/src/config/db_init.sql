--
-- PostgreSQL database dump
--

\restrict OrpcL23d9yry731dJrdvi4TBylEXLU1BWUcNgpKh8aN3cCYbHIDVQe2bJGXPTSn

-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin_audit_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_audit_logs (
    id integer NOT NULL,
    admin_id integer,
    action character varying(150),
    entity_type character varying(50),
    entity_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: admin_audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_audit_logs_id_seq OWNED BY public.admin_audit_logs.id;


--
-- Name: amenities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.amenities (
    id integer NOT NULL,
    name character varying(50),
    user_id integer
);


--
-- Name: amenities_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.amenities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: amenities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.amenities_id_seq OWNED BY public.amenities.id;


--
-- Name: announcements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.announcements (
    id integer NOT NULL,
    landlord_id integer,
    title character varying(255) NOT NULL,
    category character varying(50) NOT NULL,
    priority character varying(50) NOT NULL,
    content text NOT NULL,
    audience character varying(50) DEFAULT 'all'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    property_id integer,
    target_type character varying(50) DEFAULT 'all'::character varying,
    target_tenant_id integer,
    CONSTRAINT announcements_category_check CHECK (((category)::text = ANY ((ARRAY['Maintenance'::character varying, 'Event'::character varying, 'General'::character varying])::text[]))),
    CONSTRAINT announcements_priority_check CHECK (((priority)::text = ANY ((ARRAY['high'::character varying, 'medium'::character varying, 'low'::character varying])::text[])))
);


--
-- Name: announcements_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.announcements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: announcements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.announcements_id_seq OWNED BY public.announcements.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    property_id integer,
    user_id integer,
    status character varying(20) DEFAULT 'PENDING'::character varying,
    message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    visit_slot timestamp without time zone,
    visited_at timestamp without time zone
);


--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: complaint_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaint_images (
    id integer NOT NULL,
    complaint_id integer NOT NULL,
    image_url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: complaint_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaint_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaint_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaint_images_id_seq OWNED BY public.complaint_images.id;


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaints (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    landlord_id integer NOT NULL,
    property_id integer NOT NULL,
    title character varying(150) NOT NULL,
    description text NOT NULL,
    status character varying(20) DEFAULT 'OPEN'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    category character varying(100),
    priority_level character varying(20)
);


--
-- Name: complaints_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaints_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaints_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaints_id_seq OWNED BY public.complaints.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    sender_id integer NOT NULL,
    receiver_id integer NOT NULL,
    property_id integer,
    content text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    type character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    is_read boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: properties; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.properties (
    id integer NOT NULL,
    landlord_id integer NOT NULL,
    title character varying(100) NOT NULL,
    description text,
    property_type character varying(30),
    price numeric(10,2) NOT NULL,
    orientation character varying(20),
    bedrooms integer,
    bathrooms integer,
    area_sqft integer,
    city character varying(50),
    locality character varying(100),
    address text,
    rating numeric(2,1) DEFAULT 0,
    is_featured boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone,
    building_name character varying(100),
    flat_number character varying(20),
    floor_number integer,
    bhk integer,
    is_gated boolean DEFAULT false,
    total_floors integer,
    has_lift boolean DEFAULT false,
    parking_type character varying(20),
    house_floor_type character varying(20),
    gated_community boolean,
    private_garden boolean,
    duplex_type boolean DEFAULT false,
    private_parking_slots integer DEFAULT 0,
    room_type character varying(50),
    rent_cycle character varying(30),
    food_included boolean,
    gender_allowed character varying(30),
    electricity_included boolean,
    shop_use_type character varying(25),
    water_available boolean,
    conference_room boolean,
    office_type character varying(50),
    seating_capacity integer,
    cabins_available boolean DEFAULT false,
    user_id integer,
    status character varying(20) DEFAULT 'Available'::character varying,
    area integer,
    security_deposit numeric(10,2) DEFAULT 0,
    rent_escalation_desc text,
    bank_account character varying(50),
    ifsc_code character varying(20),
    upi_id character varying(50),
    late_penalty_amount numeric(10,2) DEFAULT 0,
    rent_due_day integer DEFAULT 5,
    guidelines text,
    latitude numeric,
    longitude numeric,
    is_fake boolean DEFAULT false,
    qr_code text,
    sharing_capacity integer DEFAULT 1,
    room_number character varying(50)
);


--
-- Name: properties_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.properties_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: properties_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.properties_id_seq OWNED BY public.properties.id;


--
-- Name: property_amenities; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_amenities (
    property_id integer NOT NULL,
    amenity_id integer NOT NULL
);


--
-- Name: property_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.property_images (
    id integer NOT NULL,
    property_id integer NOT NULL,
    image_url text NOT NULL,
    is_cover boolean DEFAULT false
);


--
-- Name: property_images_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.property_images_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: property_images_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.property_images_id_seq OWNED BY public.property_images.id;


--
-- Name: provider_earnings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provider_earnings (
    id integer NOT NULL,
    provider_id integer,
    service_request_id integer,
    amount numeric(10,2),
    status character varying(20) DEFAULT 'PENDING'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: provider_earnings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.provider_earnings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: provider_earnings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.provider_earnings_id_seq OWNED BY public.provider_earnings.id;


--
-- Name: provider_services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provider_services (
    id integer NOT NULL,
    provider_id integer NOT NULL,
    service_id integer NOT NULL,
    price integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);


--
-- Name: provider_services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.provider_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: provider_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.provider_services_id_seq OWNED BY public.provider_services.id;


--
-- Name: rent_payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.rent_payments (
    id integer NOT NULL,
    tenant_id integer,
    property_id integer,
    amount numeric(10,2),
    payment_date date,
    due_date date,
    status character varying(100),
    created_at timestamp without time zone DEFAULT now(),
    payment_gateway character varying(100),
    transaction_id character varying(255),
    receipt_number character varying(255),
    paid_by character varying(255),
    remarks text,
    ui_type character varying(50) DEFAULT 'STANDARD'::character varying,
    payment_method_ui character varying(50)
);


--
-- Name: rent_payments_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.rent_payments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: rent_payments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.rent_payments_id_seq OWNED BY public.rent_payments.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    provider_id integer,
    user_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    request_id integer,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: service_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_categories (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    image_url text,
    icon_name text,
    color text,
    description text,
    provider_id integer
);


--
-- Name: service_categories_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_categories_id_seq OWNED BY public.service_categories.id;


--
-- Name: service_providers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_providers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    company_name character varying(150) NOT NULL,
    service_type character varying(50) NOT NULL,
    service_area character varying(100) NOT NULL,
    phone text NOT NULL,
    status character varying(20) DEFAULT 'Active'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    experience integer,
    about_us text,
    phone_number text,
    avatar_url text
);


--
-- Name: service_providers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_providers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_providers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_providers_id_seq OWNED BY public.service_providers.id;


--
-- Name: service_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_requests (
    id integer NOT NULL,
    complaint_id integer,
    tenant_id integer,
    property_id integer,
    landlord_id integer,
    service_type character varying(50),
    priority character varying(20),
    status character varying(30) DEFAULT 'REQUESTED'::character varying,
    assigned_provider_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    provider_service_id integer,
    customer_email character varying(150),
    service_id integer,
    scheduled_date date,
    scheduled_time time without time zone,
    amount numeric(10,2),
    user_id integer,
    address text,
    payment_method character varying(50),
    booking_date date,
    booking_time character varying(50),
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    rejection_reason text,
    comment text,
    rating integer,
    contact_number character varying(20),
    cancellation_reason text,
    worker_details jsonb DEFAULT '[]'::jsonb,
    service_payment_status character varying(20) DEFAULT 'PENDING'::character varying,
    service_receipt_number character varying(50),
    CONSTRAINT service_requests_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: service_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_requests_id_seq OWNED BY public.service_requests.id;


--
-- Name: service_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_reviews (
    id integer NOT NULL,
    provider_id integer,
    user_id integer,
    rating integer,
    comment text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT service_reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: service_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_reviews_id_seq OWNED BY public.service_reviews.id;


--
-- Name: service_slots; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_slots (
    id integer NOT NULL,
    service_request_id integer NOT NULL,
    provider_id integer NOT NULL,
    visit_date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    status character varying(20) DEFAULT 'CONFIRMED'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_slot_status CHECK (((status)::text = ANY ((ARRAY['CONFIRMED'::character varying, 'CANCELLED'::character varying, 'COMPLETED'::character varying])::text[]))),
    CONSTRAINT chk_time_valid CHECK ((end_time > start_time))
);


--
-- Name: service_slots_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_slots_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_slots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_slots_id_seq OWNED BY public.service_slots.id;


--
-- Name: service_sub_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_sub_types (
    id integer NOT NULL,
    type_id integer,
    name character varying(255) NOT NULL,
    image_url text,
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: service_sub_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_sub_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_sub_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_sub_types_id_seq OWNED BY public.service_sub_types.id;


--
-- Name: service_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_types (
    id integer NOT NULL,
    category_id integer NOT NULL,
    name character varying(100) NOT NULL,
    image_url text,
    description text
);


--
-- Name: service_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_types_id_seq OWNED BY public.service_types.id;


--
-- Name: service_updates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.service_updates (
    id integer NOT NULL,
    service_request_id integer,
    updated_by character varying(20),
    message text,
    status character varying(30),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: service_updates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.service_updates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: service_updates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.service_updates_id_seq OWNED BY public.service_updates.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.services (
    id integer NOT NULL,
    type_id integer NOT NULL,
    name character varying(150) NOT NULL,
    description text,
    base_price integer,
    image_url text,
    features jsonb DEFAULT '[]'::jsonb,
    provider_id integer,
    sub_type_id integer
);


--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: tenant_members; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenant_members (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    full_name character varying(150) NOT NULL,
    phone character varying(20),
    relation character varying(50),
    is_primary boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_emailid character varying(255),
    lease_start date,
    lease_end date,
    rent_amount numeric DEFAULT 0,
    rent_due_day integer DEFAULT 1
);


--
-- Name: tenant_members_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tenant_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tenant_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tenant_members_id_seq OWNED BY public.tenant_members.id;


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tenants (
    id integer NOT NULL,
    landlord_id integer NOT NULL,
    property_id integer NOT NULL,
    tenant_type character varying(100) NOT NULL,
    monthly_rent numeric(10,2) NOT NULL,
    payment_status character varying(100) DEFAULT 'PENDING'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    user_id integer,
    start_date date,
    rent_due_date date,
    last_paid_month date,
    last_reminder_sent_at timestamp without time zone,
    security_deposit_status character varying(100) DEFAULT 'Unpaid'::character varying,
    CONSTRAINT tenants_payment_status_check CHECK (((payment_status)::text = ANY (ARRAY[('PAID'::character varying)::text, ('PENDING'::character varying)::text, ('OVERDUE'::character varying)::text]))),
    CONSTRAINT tenants_tenant_type_check CHECK (((tenant_type)::text = ANY (ARRAY[('FAMILY'::character varying)::text, ('BACHELORS'::character varying)::text])))
);


--
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tenants_id_seq OWNED BY public.tenants.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email character varying(100) NOT NULL,
    password text NOT NULL,
    role character varying(20) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    avatar_url text,
    status character varying(20) DEFAULT 'Active'::character varying,
    phone text,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['TENANT'::character varying, 'LANDLORD'::character varying, 'ADMIN'::character varying, 'SERVICE_PROVIDER'::character varying])::text[])))
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: watchlist; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.watchlist (
    id integer NOT NULL,
    user_id integer NOT NULL,
    property_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: watchlist_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.watchlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: watchlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.watchlist_id_seq OWNED BY public.watchlist.id;


--
-- Name: admin_audit_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_audit_logs ALTER COLUMN id SET DEFAULT nextval('public.admin_audit_logs_id_seq'::regclass);


--
-- Name: amenities id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities ALTER COLUMN id SET DEFAULT nextval('public.amenities_id_seq'::regclass);


--
-- Name: announcements id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements ALTER COLUMN id SET DEFAULT nextval('public.announcements_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: complaint_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_images ALTER COLUMN id SET DEFAULT nextval('public.complaint_images_id_seq'::regclass);


--
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaints_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: properties id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties ALTER COLUMN id SET DEFAULT nextval('public.properties_id_seq'::regclass);


--
-- Name: property_images id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_images ALTER COLUMN id SET DEFAULT nextval('public.property_images_id_seq'::regclass);


--
-- Name: provider_earnings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_earnings ALTER COLUMN id SET DEFAULT nextval('public.provider_earnings_id_seq'::regclass);


--
-- Name: provider_services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_services ALTER COLUMN id SET DEFAULT nextval('public.provider_services_id_seq'::regclass);


--
-- Name: rent_payments id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rent_payments ALTER COLUMN id SET DEFAULT nextval('public.rent_payments_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: service_categories id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories ALTER COLUMN id SET DEFAULT nextval('public.service_categories_id_seq'::regclass);


--
-- Name: service_providers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers ALTER COLUMN id SET DEFAULT nextval('public.service_providers_id_seq'::regclass);


--
-- Name: service_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests ALTER COLUMN id SET DEFAULT nextval('public.service_requests_id_seq'::regclass);


--
-- Name: service_reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_reviews ALTER COLUMN id SET DEFAULT nextval('public.service_reviews_id_seq'::regclass);


--
-- Name: service_slots id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_slots ALTER COLUMN id SET DEFAULT nextval('public.service_slots_id_seq'::regclass);


--
-- Name: service_sub_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_sub_types ALTER COLUMN id SET DEFAULT nextval('public.service_sub_types_id_seq'::regclass);


--
-- Name: service_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_types ALTER COLUMN id SET DEFAULT nextval('public.service_types_id_seq'::regclass);


--
-- Name: service_updates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_updates ALTER COLUMN id SET DEFAULT nextval('public.service_updates_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: tenant_members id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_members ALTER COLUMN id SET DEFAULT nextval('public.tenant_members_id_seq'::regclass);


--
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants ALTER COLUMN id SET DEFAULT nextval('public.tenants_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: watchlist id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist ALTER COLUMN id SET DEFAULT nextval('public.watchlist_id_seq'::regclass);


--
-- Data for Name: admin_audit_logs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.admin_audit_logs VALUES (2, 28, 'Added Service Provider: Sairam home services', NULL, NULL, '2026-01-28 21:02:08.023174');
INSERT INTO public.admin_audit_logs VALUES (3, 28, 'Added Service Provider: Uzumaki home services', NULL, NULL, '2026-02-02 10:26:10.20354');
INSERT INTO public.admin_audit_logs VALUES (4, 28, 'Added Service Provider: Abhinav services', NULL, NULL, '2026-02-05 13:16:01.962506');
INSERT INTO public.admin_audit_logs VALUES (5, 28, 'Added Service Provider: ajay services', NULL, NULL, '2026-02-05 21:03:16.771259');
INSERT INTO public.admin_audit_logs VALUES (6, 28, 'Added Service Provider: Zenin home services', NULL, NULL, '2026-02-15 22:35:58.334573');
INSERT INTO public.admin_audit_logs VALUES (7, 28, 'Added Service Provider: Zenin home services', NULL, NULL, '2026-02-15 22:37:53.583663');
INSERT INTO public.admin_audit_logs VALUES (8, 28, 'Added Service Provider: Waseem home services', NULL, NULL, '2026-02-15 22:53:39.4606');
INSERT INTO public.admin_audit_logs VALUES (9, 28, 'Updated User status (ID: 27)', NULL, NULL, '2026-02-18 13:56:49.234591');
INSERT INTO public.admin_audit_logs VALUES (10, 28, 'Updated User status (ID: 29)', NULL, NULL, '2026-02-18 13:56:58.613009');
INSERT INTO public.admin_audit_logs VALUES (11, 28, 'Updated User status (ID: 35)', NULL, NULL, '2026-03-31 02:37:04.629499');
INSERT INTO public.admin_audit_logs VALUES (12, 28, 'Updated User status (ID: 23)', NULL, NULL, '2026-03-31 02:37:12.399028');
INSERT INTO public.admin_audit_logs VALUES (13, 28, 'Blocked User (ID: 34, Reason: suspecious)', NULL, NULL, '2026-03-31 02:42:52.648333');
INSERT INTO public.admin_audit_logs VALUES (14, 28, 'Active User (ID: 35, Reason: Your account access has been restored. You can now login and use RentEase normally. Welcome back!)', NULL, NULL, '2026-03-31 02:44:49.271314');
INSERT INTO public.admin_audit_logs VALUES (15, 28, 'Active User: bhavanimuttukuru@gmail.com (Reason: Your account access has been restored. You can now login and use RentEase normally. Welcome back!)', NULL, NULL, '2026-03-31 02:51:37.577191');
INSERT INTO public.admin_audit_logs VALUES (16, 28, 'Blocked User: bhavanimuttukuru@gmail.com (Reason: Your account access has been restored. You can now login and use RentEase normally. Welcome back!)', NULL, NULL, '2026-03-31 02:51:45.029077');
INSERT INTO public.admin_audit_logs VALUES (17, 28, 'Active User: bhavanimuttukuru@gmail.com (Reason: Your account access has been restored. You can now login and use RentEase normally. Welcome back!)', NULL, NULL, '2026-03-31 02:51:57.978946');
INSERT INTO public.admin_audit_logs VALUES (18, 28, 'Active User: toji123@gmail.com (Reason: Your account access has been restored. You can now login and use RentEase normally. Welcome back!)', NULL, NULL, '2026-03-31 02:52:52.604752');
INSERT INTO public.admin_audit_logs VALUES (19, 38, 'Created Property (ID: 25) - Title: Sri Lakshmi Residency', NULL, NULL, '2026-04-05 18:32:52.982703');
INSERT INTO public.admin_audit_logs VALUES (20, 38, 'Added Tenant (ID: 30) for Property (ID: 12) - Tenant Name: Ramjaaly Jaswanth Raj', NULL, NULL, '2026-04-17 01:09:00.039613');
INSERT INTO public.admin_audit_logs VALUES (21, 31, 'Listed Service Service Request (ID: 29) - Name: Cupboard Hinge Repair / Replacement', NULL, NULL, '2026-04-20 13:55:55.235481');
INSERT INTO public.admin_audit_logs VALUES (22, 31, 'Listed Service Service Request (ID: 30) - Name: Cupboard Sliding Door Repair', NULL, NULL, '2026-04-20 14:32:30.758246');
INSERT INTO public.admin_audit_logs VALUES (23, 31, 'Listed Service Service Request (ID: 31) - Name: Sofa Assembly', NULL, NULL, '2026-04-20 14:39:08.643041');
INSERT INTO public.admin_audit_logs VALUES (24, 31, 'Listed Service Service Request (ID: 32) - Name: TV Unit Bench Assembly', NULL, NULL, '2026-04-20 14:45:09.860965');
INSERT INTO public.admin_audit_logs VALUES (25, 30, 'Updated Provider Profile User (ID: 30) - Company: Uzumaki home services', NULL, NULL, '2026-04-20 15:21:26.936994');
INSERT INTO public.admin_audit_logs VALUES (26, 30, 'Updated Provider Profile User (ID: 30) - Company: Uzumaki home services', NULL, NULL, '2026-04-20 15:21:48.369309');
INSERT INTO public.admin_audit_logs VALUES (27, 30, 'Updated Provider Profile User (ID: 30) - Company: Uzumaki home services', NULL, NULL, '2026-04-20 15:30:43.663');
INSERT INTO public.admin_audit_logs VALUES (28, 31, 'Listed Service Service Request (ID: 33) - Name: Geyser Check-Up', NULL, NULL, '2026-04-21 11:37:05.036984');
INSERT INTO public.admin_audit_logs VALUES (29, 31, 'Listed Service Service Request (ID: 34) - Name: Geyser Uninstallation', NULL, NULL, '2026-04-21 11:39:14.861183');
INSERT INTO public.admin_audit_logs VALUES (30, 31, 'Deleted Service Service Request (ID: 34)', NULL, NULL, '2026-04-21 11:39:50.903915');
INSERT INTO public.admin_audit_logs VALUES (31, 38, 'Updated Status House Visit Request (ID: 7) - New Status: APPROVED', NULL, NULL, '2026-04-21 16:09:24.926347');
INSERT INTO public.admin_audit_logs VALUES (32, 52, 'Created Complaint (ID: 13) - Issue: undefined', NULL, NULL, '2026-04-21 17:03:33.507714');
INSERT INTO public.admin_audit_logs VALUES (33, 38, 'Requested Service Service Request (ID: 34) - Service: Geyser Check-Up', NULL, NULL, '2026-04-21 17:07:32.59339');
INSERT INTO public.admin_audit_logs VALUES (34, 31, 'Updated Booking Status Service Request (ID: 34) - New Status: Accepted', NULL, NULL, '2026-04-21 17:25:53.492898');
INSERT INTO public.admin_audit_logs VALUES (35, 31, 'Updated Booking Status Service Request (ID: 34) - New Status: In Progress', NULL, NULL, '2026-04-21 17:26:41.975818');
INSERT INTO public.admin_audit_logs VALUES (36, 31, 'Updated Booking Status Service Request (ID: 34) - New Status: Completed', NULL, NULL, '2026-04-21 17:27:01.380896');
INSERT INTO public.admin_audit_logs VALUES (37, 52, 'Updated Status Complaint (ID: 13) - New Status: Resolved', NULL, NULL, '2026-04-21 17:38:37.185898');
INSERT INTO public.admin_audit_logs VALUES (38, 38, 'Service Payment Made User (ID: 38) - Paid Rs.240.00 for service request #34', NULL, NULL, '2026-04-21 17:50:14.145913');
INSERT INTO public.admin_audit_logs VALUES (39, 38, 'Service Payment Made User (ID: 38) - Paid Rs.240.00 for service request #34', NULL, NULL, '2026-04-21 18:41:54.404788');
INSERT INTO public.admin_audit_logs VALUES (40, 28, 'Flagged Property: Commercial Shop on Main Road as SCAM/FAKE', NULL, NULL, '2026-04-21 21:01:34.316543');
INSERT INTO public.admin_audit_logs VALUES (41, 52, 'Requested Service Service Request (ID: 35) - Service: Door Installation', NULL, NULL, '2026-04-22 14:24:26.260836');
INSERT INTO public.admin_audit_logs VALUES (42, 31, 'Updated Booking Status Service Request (ID: 35) - New Status: Accepted', NULL, NULL, '2026-04-22 14:25:26.44826');
INSERT INTO public.admin_audit_logs VALUES (43, 31, 'Updated Booking Status Service Request (ID: 35) - New Status: In Progress', NULL, NULL, '2026-04-22 14:26:14.883923');
INSERT INTO public.admin_audit_logs VALUES (44, 31, 'Updated Booking Status Service Request (ID: 35) - New Status: Completed', NULL, NULL, '2026-04-22 14:26:27.201456');
INSERT INTO public.admin_audit_logs VALUES (45, 52, 'Requested Service Service Request (ID: 36) - Service: Lock Installation / Replacement', NULL, NULL, '2026-04-22 14:29:27.21117');
INSERT INTO public.admin_audit_logs VALUES (46, 31, 'Updated Booking Status Service Request (ID: 36) - New Status: Accepted', NULL, NULL, '2026-04-22 14:29:59.633253');
INSERT INTO public.admin_audit_logs VALUES (47, 31, 'Updated Booking Status Service Request (ID: 36) - New Status: In Progress', NULL, NULL, '2026-04-22 14:32:04.933079');
INSERT INTO public.admin_audit_logs VALUES (48, 31, 'Updated Booking Status Service Request (ID: 36) - New Status: Completed', NULL, NULL, '2026-04-22 14:32:09.756343');
INSERT INTO public.admin_audit_logs VALUES (49, 52, 'Service Payment Made User (ID: 52) - Paid Rs.300.00 for service request #36', NULL, NULL, '2026-04-22 14:33:12.610137');
INSERT INTO public.admin_audit_logs VALUES (50, 28, 'Changed Visibility for Property: Sri Lakshmi Residency', NULL, NULL, '2026-04-22 21:12:07.463469');
INSERT INTO public.admin_audit_logs VALUES (51, 28, 'Changed Visibility for Property: Sri Lakshmi Residency', NULL, NULL, '2026-04-22 21:12:28.857583');


--
-- Data for Name: amenities; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.amenities VALUES (1, 'Parking', NULL);
INSERT INTO public.amenities VALUES (2, 'Pool', NULL);
INSERT INTO public.amenities VALUES (3, 'Pet Friendly', NULL);
INSERT INTO public.amenities VALUES (4, 'Gym', NULL);
INSERT INTO public.amenities VALUES (5, 'Lift', NULL);
INSERT INTO public.amenities VALUES (6, 'Power Backup', NULL);
INSERT INTO public.amenities VALUES (7, 'Security', NULL);
INSERT INTO public.amenities VALUES (8, 'Garden', NULL);
INSERT INTO public.amenities VALUES (9, 'Swimming pool', 38);


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.announcements VALUES (5, 38, 'Cleaning ', 'Maintenance', 'medium', 'Cleaning of the room and keep your belongings safe !...', 'all', '2026-04-17 02:31:38.91093', 12, 'all', NULL);


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.bookings VALUES (2, 5, 33, 'Visited', '', '2026-02-14 19:55:00.710983', '2026-02-17 20:31:35.881246', NULL, NULL);
INSERT INTO public.bookings VALUES (3, 10, 40, 'Visited', '', '2026-02-18 14:28:59.529492', '2026-02-18 14:33:16.469252', NULL, NULL);
INSERT INTO public.bookings VALUES (4, 10, 50, 'APPROVED', 'i am visiting at 11 am', '2026-03-31 00:40:08.358117', '2026-03-31 01:56:15.364317', '2026-04-11 05:30:00', NULL);
INSERT INTO public.bookings VALUES (6, 6, 50, 'REJECTED', 'kk', '2026-03-31 02:19:26.106913', '2026-03-31 08:05:47.33637', '2026-03-31 10:30:00', NULL);
INSERT INTO public.bookings VALUES (5, 7, 50, 'REJECTED', 'hi bro', '2026-03-31 02:08:52.578903', '2026-04-15 00:02:04.605171', '2026-03-31 18:00:00', NULL);
INSERT INTO public.bookings VALUES (8, 25, 52, 'APPROVED', 'HI brooooo', '2026-04-16 19:58:11.957254', '2026-04-17 02:29:45.01731', '2026-04-23 15:30:00', NULL);
INSERT INTO public.bookings VALUES (7, 11, 50, 'APPROVED', 'ok', '2026-03-31 02:23:33.261945', '2026-04-21 16:09:24.906534', '2026-04-24 13:00:00', NULL);


--
-- Data for Name: complaint_images; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.complaint_images VALUES (8, 12, 'data:image/png;base64,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', '2026-03-16 00:26:53.82056');
INSERT INTO public.complaint_images VALUES (9, 12, 'data:image/webp;base64,UklGRrj1AABXRUJQVlA4IKz1AACQCAOdASpYApABPikQh0KhoRDUG42kGAKEs7VjbIkJRF+MwHZGzSpv+qdW/X33sRx8n+I/w/yT/hvl//t96HvH/b8vTqHznf971h/qn9m/gO/VP/bf4j/IfCv/zewD94/U1/Xf9t+33vU+mv/JeoT/c/+N1tHoP+cl/9v3O+G7+7f9394PaA/+nsAf//25+eXi085f3/5Tecf5L9G/l/7r/lf+B/gPcS/5f8p5POsf+x/nvUb+XfiL9b/ff9H/2v8j+6/zX/3v8/5I/nf8L/1v9J/nP20+Qj8m/nv+f/uf+U/5P+K/dL6ifsf+z/s/9d5Mm3/6H/r/6P2F/ar63/s/8Z/nP+7/kvf9+y/6f+j/Hr4s/Uf8z/3v85+U/2A/zT+o/7X/A/u7/lv/5/8Pu7/f/+T/V+YF+H/2v/k/0vwBf0P+3/8f/F/5P9q/pj/uv/H/p/9x/9P93///fp+n/5v/u/57/SftT///wE/mH9b/3P+A/zf/t/0X///+/3l/+33KfuH/9fdP/YT/zfn+aPfw2/cUHzCep31Xpu52uO/J2Wp6wuGuI0a1kf1PlnDJ7I2wc7rvRC9PhljjvoQq/X/XS86yRqsNXsPdx9gW6J4iqcMJ/2hi6rYgOOKl7T26UapXpbqkkVB6NEgjC12fU8pM1p50q/QdobFZWSKODUxxmHIP37UHnRLSH6W1DuGzO/1brRfBqGrw/kH8cY+NVD4DxF5072EMpxuuIurLwmyOItzevtj3B6+glg4v2CXjgVvFz9iqJiAqZ7gzetKwzQr8DpUxy15buHhfOO6moNUw6sB2ZuFY1Kt0i464+QC5bfWtQvfi4rGNgQgZ0KIrSgZjnFHehWFcZ1zq1yxjmtqUEyOg5gXDzOmStQfdKG337O5jIgOO8Xs+olAl4C85XstPL+Z5YffGphIyhrySz6fva+aGqDMxiHJD1Z9X23a4SdaIV0N/fFNdL8viCmStX14V5a+8SuAyqU0SOgb7FilChBbneC/K9nLylAM27s5yxcgnVyj/eHBejdwQbYinOoE2/v+/meVEnFiAB6covjcWODjwG5YJkY30DsB4U7rkgwBisy7vQmY9OO4A/m2gYFuv1sumwr/rmI8WF4HPD4PlqjhOrbWNS/JdD7QImU+uyI0DkkreVujTkuFfcdJ2xh9LM0DQ8SN8E3zWAKdY1ruq1TkVo/fT7ofJTsHr5Ht95sZa7uhgG07c7UUOydjFtT+EgESwHHs+0P/FC0zfZZk9BCarjIFcINA7nctg/HqMXClKyDW3wei0XpmBx7pJkNrWzPSlnJLStW8JHFWeJf1pl7g3RZ5a07OkFwNio/dohMktEmF664n3mVBQ8+W69dc5uBCz5vlhVduZNonthfOTFn5oAtci9rfmzRHG8pot+LAlzvOW6k0sMXSQ/w1WtKHGlP+AQd8AhhJb7aWvYWNmqEsVzw21P/cc1NqYcaiXokqFvDFSzstPZlnbJ787p9/6Xg58Nd+vTJ/DWvB01FY03gFylayi1KspfaEM53tEB249R/QSXh2Dck8b+CHgOZGdwrvNgGqsBaVw7JOADmJrxhwf+Poqr6WPAfUPp8Td86ryn52PR/EI2F1xmoS893DSUX67ZjZVOg/hrldihbltDOSJHEp5LV3x/eSiKOJYcpgJOo9fzam39R/91v3PSezkmQPaoa/ILIKK892rprHGgEnrgvhUWGTN8JzWJGAURcrn28QOiXnBN3GJmRM0UxYPJXS3D4SDGaaJYa1QP1facEpWRRawxa3p5Eahsgz1iHv62dYNgYpxaoW6jbz1ZIXvp5HK+/vw+2ibF9kwjBYbFsdRB9pDIKPBcfus+vScs5zCVHdLEWJf/+VZBmPrZAEYpPww0L7fbnHWTyHKLe/dthvt7ltiL5M9Rfqk2xnAr4aedIX8pm1qnoCRrHmu7Kct5iljfIOQbANp1qq7+LtKKCwpiy3ZqkBxwg6iFska9zwGcVvsoIecuxB3Ku/Hk+OSO1gkxbyp1d+7BOwMl4mJ9L5x94Xpy2OQyENTePMoP//9TEKKcsEBMGCDVOJ1b4kCHcpEz6OjkRS2nqqPPlvbpLOQy/aXKR+AF208jHj8KOJEkIqE9Jdxwz7DWtwiQjHRUKYuTR9THa3VZzQ97wpGPMFhBbUslALL+ZL0FDWc3KW7RNvV9VygKLVnMbrgTC2+FCf+SGB2rXEBB/y5aZm9tAkDp5CAnEt3IOzs03YYyLG8KeM8efIIOa88YGY5cgzA17+CGXZLk+YvbIuGiMwBSp8ppw5uzKk0encd2UfDSZsQB0U5t7HdGCfxqaUvV0aTk9UY5b2F4w/Awhz0xQQ3/+b9a0bunkYvfUgXLCwf8Sc6D7+JTXal8M3IA2E3pScU6l7S+/YPZ4/L8vmXQuIb31IUaKVyKnPy604mZiGyGucbJO1hAqTlwxpl4TaqpzcZOFx7wNzHB/Wbw+WiSDMycYlwt8vzfgcyQVFo+1avMqGHfTVIpVs3Um0ESI+8PDXlD79ERCdgkrqRtsWLHezV5Qa9NaLoFGX6P5VGUmEU8xNDvKBk40pp3/xUekRhalfiDcfYwZuRHJCwHdAVxMDA7X8KpGPeb11whW6ubtj5YU1GSRz1yyNBNVBC2jegbTIaxjUACXRcLKyXriTfdqdmhNa1mkAnxjI0c+mSL/cKY/VkLGq05cTqHD/i34ZAok+owDFGlgyZjzo4BpGLHKy6gBsaQ4hb+fdCuRrhv+6Y7/x7QUvUPUQk2iLL8mzpWvui/s9uCsUmQNfLfJFoSse234V/kjF5fj2OSklCJWL1u3iJkuGEJuL9qE/ppkbMxIacvzLqkIWGnRAFLjm7D+x9F+h66KtB0mWYUR9OURgPdo8Hw5fP/OIW52z99Ue9YfDj7zpg8txB/cABpY8chGnNR1Bd60qk6202rCuACyaY/YdZ2/nsVE+YZmCVhqZb8wr1GvMw7/mw/Xs43upJplThX/bF+I3ZSGuVAGrpQNf5F/7y0LRAY3wV7tnWx1ky2ro0KwIi2PIpdPhswwpfuoU/PFgChMj88RyNhO4OXGpbLHE/0/XL7943okxsJoIjVQ1GPhV9C6H/d07t7KFFLp0jb0J6NUjbeYuyPuZkhnN9gHbvu2Gh8oYlwGvYCrfuP5Y2eIjusvhPxlUF/2PHHWFTO3CE54qJHoCQ7cQc7iw+RWK6iJNtpbnHBNkinuIbJ2+P/iBsvYEuJk1IFKMRqs2v/gr1t5V/0rKChInw1FHDZYZxAuRy4wcA0OhNB8epHeHTPSCWgy2s/mxiagbrsXzlGa7YK4moP7/tzpU0IA3Y2qlqraKr2VoAoDPOvCszIcvUx1H6dwxPPolgSZ4rT+AlAJpjHjPKYa0HTQywTz36japVlNbOari3YFP0nKgwAz2ua5jY2MUB31w9opZT488B5Eo56nMjKbVqns2mo9R8Syoyhvzv3pJAWWzN6XdjSIgi6ERt/ZdXP+c5os0a+bz4D72r3/R/oGhqp28TE8nzqMdXmGzqN/ZehcPTC10Uw7OsQOtqnLA/Evjw0UdHlewOswdaQhrrMRTTvqaES1LCCYTIzn9gYp345U6NHchMRvz4HdzgqokOzr5fKp1Yc8GufAi5fu5dFag4c7pEcQK17MU24g6fq9GwDnlm3lsZDpIM+oFL7peVSg8wv37lelk+riZR4SpXpMNjsdU8sAuizT6y7YPv/XxZRtK+Ly0fuXviX7uiQqjUuCJqpt06ItF1Fk6cVNJ79dsuQ2PpKgWCGNfmpgprieGOQJLJVu4KqpyydSt3UHNQtgERGa0DUS/vojnVQ3ygoytSJZpIKQG3FTNb3AshMj8GQ0aWmTvUk4+PwXSnOYkugTgzMZLQezpPT2NDTthf9KKGkb6viJ4rOb1bCVYVRBX6bZ7gLRJ+j1kx1COzeJkpv6C1GFiDnRiALOw2x8Cp8tpl5eoGK+3MzLUbzSQVpl1Smfdb/iFqX7Jw08f4qjluMrFV32pKkdedX7RmQbO6DWGK3O6URzHWX5d2Cqp/1gI1e1MKP2y7w03dFFOUdAHhl0XlqNhQySbxHZiBjQokkdsc7kW8vhHc+t1ygzwRjMKoU5c8dEpNFGKKWuE+7PiOhcNv4fPIcH+L51xni5cjWaLyaYZv9vU2ZVFJFrcHzH8Xa2C6FAgevek+BImSXRKUTufcYJdjDrjRuNZ8qfKcqa2W24MWbJDyuTrz+Pd16Hya9ID3TwmzuH/F8IliNwfZGFknlW+LhGk1MZIWrMHRjiyYEpi48lJX+UpK5un8/gQIqEOTaeLvIZ6CZs3taQzk3cyuqX2eACk51rXy4bCZOqM1EcinhNvxoVYHBeh6A83ESAF6XgicByYyrNQhuZZ5wnZ9x/SriL2w+hjQRyUAREg3//Xj+BoYHskktd7uF/rRA++ZGKVcCoHm5z0Pi73O94ZU087RmOzQlIIQwtxgh0/0fz8Gg1JeMeOK0/3A1BBC5kvjBZdiaFiNI5v3FSHVE3+RtfjgQ4O9/JdsSNBzywSJ1TEdoHs8MGFOKr7f3t0kSKVLC1PoGd+4YaDIzjYVBAufqd/oUok8gM/e245VDBcFyLbF1YRe3NwkPZ8ytNy0EfEdY0vE7Z/15CurnMquIk3Kx7S00QLdCy1+WaU6zKKN3EkPSSJP623C0QMkbdn49UXaNmySEJmcvoVytSbFsMBNMY4UX2t4Bw2ju7M88V3nu7E1AoxKj7xyK52oTe+NtflAIE9JUu5M+4Q/qFrOdtrjO4x8nWM+rjnNVPGzqc7tFDTYZi3lOQ2YDlPeo+EXgmtf23myTHTn8VoKY9rXVYohBiIkyL+TDIbvE+3vIVxRooWu66DDd/XRyQcKR49V1iBxco44FgbVoIRjb8KGifjIGKK9p2LU/DA4o5c5ljURPe36v7/TXtdTDOYDuJ3PnmeMwJDZrVyzd8n4px6Taj47CI3CzhNEU4BioprmFdEOrncJtHFJKF2r5dIKIfRwSdKdbsYHMT008Jp0sX9PQCJQVgkadKPHoUj2C+Ajh81sK95t8Wt8+RrdeVbYExnPPn9lPb0s8gXil43kLAMhaG3H01u6HXK9+xf+AKnkCOVqs6TW38qq0qE+igj2ZsRHx1cAxn4w9ihO1MquF6oGocJPucSuv1Jb2I+o5soeDIQ0MtFweIveLeGZQnzW8vFVxA0V6fjUQctdrxA52iUYAqJV++FZFgAURflvTlEa+azwDR6cNeHxvyqx7xczyN9LNSuLJiHTFuReh4b+FvUtKQvUMQHMsrr5RhQHUrBvB6rwkz6jpeh6kG/W/PLxH6gffHWlBmbSG8B/9T2mrVvvUvoO4EzvqM9Nscdnb9numY+Bd1J7ttthgkrwnBuRZoCmi/tLqVB2M2lto6XnucgFa3VjdpElweAnuqDlwRRNE15rBYOWhtFkOZRfzYMAXhv5ilqnErSLv21dFlwL8TbZPE90aFT9vj97qpkhFrEqOXxIGG/68feIlo+aTf3CzQpeM2Y1A42G+SRuqb3pWnFpOlwYS+mVIEEWPS3VEKBakwhQ++umfzSho7LwHddwGEKfypO7yHJRHXjGkvtVDRK01FBERNyL4HBhpIB5lM0YuNc8h77XLA5PbG1tuLSPeEi0V9dwvCunkZVPTJxXq0dFC5a5tON5yYKNcz8F3s6q6PVqpO88obsUpui8DWZi8b2qqacbZupfEUtLbfpZEHlUCcmyMbks1+C2HFnBsx+8DBo+EjH89iwNDsPQ8f/lVmhVWdUOtu+NLcEUTX2QwtzvMdEQGpW0YjGMM2EGGcpy5xhN+LqAr6UNf3olu5HXLTFtuIsbSf+KwIvRzo7vAPEro8uHulIQSP6XmDDWkFgV0KX7ZqL7QvZ82Y4nIikVu50Rjavkzu4k1odRsud6ltJlg+6RAtFRjGcZ94r+S8ebkejuIS/x+L4c2fV1F9etkr9tQY9K25EsL+ZetK9eVFSfgyS+W99Z94X+yGqBJeSr96yXz1hokjxxa7ystS7/SWp3wSluWni/DDttSMIyL5K243t6+2HZ1nPywd9F9GIBENxx5t7nQk0H1f2TX4duNNzcFG83A2loIU6Is+7cy1yukNnbWILs2skg4QMVMgRXcFg8ThkLLEhLxB7XOEngXRLLuBr+1SGktv+zfoYJ6gMnov91Fk4GNKyFbSKTqSIEr1rM2wbvr9ZF9jJabtO0q+N+0c9RntNBWjwztyjnC+gY12UFQhljyOLctk0pg+SnA2nvFTQL3reThgPv/qknsHWByJ9zaW7l9ImjWZpAyqu6VVHuMh4tfkkhT+pTq2Vt0uS664JNqtxwOkQFoHPGJBURyuNnet7n55Z6X/IyfORdjnSs9HqnN+ysqTvjXeRt8zDey4nS4zd3rM8GSBqQ7+5skLAYh7sbhs5tE2ohmTajzPmC+l6LHCBexT0EuRHEukzkjdbJ4vbnRqaaIy7uqVMwUudb9hp7fdZvVyPVordmPF4vlSdkoHrcnFqlIvbU5StbBZ/OPI5DfksvpWBXvYI3jt6jR0azpqFBgy407IZxbHDcDFdmmBJ3uTnrCe0fuLzj3m83WRyLTJ5CzNXRa+eYANFpbfnV9QYmiPbJJgCo6uvOwIf3g6DSXILVryNbmSTN+D//plubv9QNg7ZJ/1tYO+T/BJWYh5gu0/smiEjzQAk4FS5sZ7TgymLlU5nvuvea3zYKwbYeKdJqW3jAKH8Q2Re6ndiN5WseXr8TLAFMUQzg2TyQfDbV2boZzj1SNerWBvjpvc2CCeBDh2QKNP8gcCM3/HLViAjQCj4B7rqLkTutn7MOKRdyhloJzr0li9Ve/zTtT91NlXiikUP8gYWhAsgvzYvrHuNs2NpiHNGw0zXsfcJyN+8YP+crf8G7+Cq8T/SIIG+VDSZDkkM8HeaqdbKnDQqx4DNH2zuDGleF+tXqOOx/Ro/xGXJ/cgWVNfG2ez0x4/qnftXi5/3E2q73aX1wATe9K69cuzP3JfSRHaTpsQUTeTKeOtmIOfBe/CmWxR6h3t+E+xdeq0roAO+Nu80G5izHPM0nXyLU2DD3OPnLJAQs6EnH0a6oQHjyQdQxCPdWJ/yos1IKOMprPFdoNUXIZm5zIUblcX99ZqRH5sPLkpG3Rc5tVbonoJe0Y88IjwpKEnrzy5rFH5aCCUHEjqBJxwzpfN6woWegln8tngLiiJFC+l1SntMNPHAz+3wAwT/UVYsPVCT2Pjud8xStbOjrry4X9Pgs0/G5eNqxH2HzffCZiUsYho2M/Bo8jS5u/g9iAOZmbsOEVxTNuKhUD0Dyh///9D7//0eOI6Oosy8q3ZWzlGkv3lLsS3kvWhO223Y3TO8aET3vUqAOcovtcd9X9DZsxd5YCF64q7T7QuKJSfVbFWGI5TqWfhBe2p3qBM3dr88PX7hSrg7tMqDWG8vHitGqsV5Dr5EYEmFy4zcrfRzmp4Pr7hTdRyPNKzhR/cHJyopYUUZkkIVqqm17Y6QFReCp9+pm+bpegUJMfaDNd+G3yPb8IVvd+lEfdM5ELg/NJGLR70mMS+x+8imeO0rCs/HIE6DcS9f+OXur+P6ptQR1T7E6p+LvV0T/TKvw6O+wHrWG5R//6M7k+1UvT8cYP/8GytFSiU+eWLwXN31BrLqJduLXYHAedkZ0ruc+b67helhlfOV8fCqHDYOgKD4y8ZN6PTiYs3q0uLxg7V1DOrhcGhy+eEdhWL2n56NzW4RFeB+GdRXlNsjOT5d0iC2JN1X2NqDBuDW3e731z+rdFEEBqC79NnMg1HAHGlu1ZyONOYL6/VSWCFqfLGfOqy84qfI4FX1BdK/XDP3m80szadlMGfSL7Pzn+3DW4rmIYa3GPJbs4bItW8p1LDe36wnx7EYcwRAwDuZXUBg7zQXIXHR39IjiviRAkpuZdlNK//wcuvop6LZs7ZhPfkW01CqX75VwJG6T1r7tJI4Esp90yYDZfnEGaH0SrH7iY8k5XX845LwhZ6LGtICDkmQj4LdP3hwZyaMIIfh89lUXLNMmYzCSDh2JiRD5PKA1lhIPu/9247UKWblxC3fNLyaYtHun8lMu8V/BOH0io6xMw4qbWlV1c1uZnFDzqWIS0Xrt7DSseA9fid9O8e+hVKg5JY6gpYbH9JEdN8gwBv7O5ogUVaN1DEwCG3DfhrUyFqapI6Gmvu/s+lLNtdp2SHFlFmhtNdBUrjn/o1P8Qhga64YPFh69BolEFJEl6QqLK1WiQy0LQ21/rLJI8Qm8ZGKaWtv3lm2YWBCEMSlsTQ+tSbD3G2c1QAD+/vHKNNnOi3ofcq2YT6rNnC9vgnyu0iYnHamvqztjYGuCyzLae26ZeorE2dIs3bvX2/EqssZlB01ZFL8oLpuMafkQDuCcCPTUERkWxcO9WYiFP1u38a1vIUPlRM2z2p/AKC/fLhUWIG/RKbMeFXXGF9blXcYYUrx7EcR6XCFgMrMbidVbucVel2AUw4ppsjhIr5LuTEuA7aeapNDXSvJqkeBNwEIjD+I8GJoXZtiq5faLSTqiJ7/J1e+QwkQeIHQeyTEBg7gmZMZw7LJCgH5SklVExyXVcFv2bOEWiqkVsDiWugoSXc7Bz8vUKAlQeKT/xazsTNBvT/YEFxTQf1TDcJelaVrlYTetPnFcHR6F7J9kZ+MJ6F5TZia8DIC3LmDmYXQiNDT4fnB4E+zxYHiyD6LzYt/a3IsZYQ4TuWrq7euisY5UskKwx0YsViD0ruFNZMuWNjFTOVhVkRB+v0WGvRJxxIH/odHgGnx+WX65vhtsknmylIPjHwZyDDfr1gFa4AcYlJZJ5dq7eLI6so8R8Kh8renI75IPZamqeYB/2+sv91YgmaLzpTe3XsBdUlSREJ6HE07a+eUSlKUuq/axTyaF3t2FEK9muCLylGerZinqZDZOxBVbq4IwQEgtr3pYdyRDET4Frl6DbuUhdAi6ZOf0ajRa6V52UakOI3zt7bTFEl1pRiePuoWoLDpnJeRqJzWrXz+o4nPN3qHOQCeveGC1hYTRjm2cLVc2Na5xtp9dDoxesb2wp52vFS1Ya1t1iQ+POWi0eRWxjnd3BxKPdIQ370g/iraQi30yhg37hey/GYKjdQKDYdM7kqEfX4TpsZRrikVVHxEE0ZUZu6XF/gfaz0O7BFlH+iQ+tHW8vPrxIrP/KOc/GzBhP8I/vPCZnQRKbOZVhJiooBEZ+GybBmvNRdfR0xFFMA1TYElCuqfD1W19COxbS6iD+i0ahev7Pt/3aqQLTIv19x9OARDf/hp1oJSDuEKQHgBAVjrSjH9KVv7Sjw0+VUeKaeCcuybI1bgOHHDMfhbWtYVrM/jkn3cH++18Zme6nbOKhssc1pTqlnfz+5jqASy2tzL3N81+W2NTxf5kyAPonySJs3Gb/ckfP32yUItpbEh7k3/oGcklBhxHKvZkliGx5Vd6WZXryPNqDr4WnUE6T0ooPU7oSdKUHz7+gVi1jvb6iIRTL1rN4jAcOmAzZ/TbD8HUfmqUsEeyuM6L01HOcmSdxVEJerNtSgVujZuJjMoyQQHbfIx07sBZPbTc++a//tFK4WWOCP32CLfIq8qdw+FMGwF5puUyDN2kRnIvq9hjpuIscnGTmSLmtLqWj2fAwRFHcgUNaOql4tQzv87xNsgKGIk5cmTz6fnYY1ZutUroaRIpg1Jh0UZwy3lebapQ0D7uXJihjJstPE2nC/zeTgaEd5t1MqE5aLxsEFDcXtKqVtKFDINdGVuRodMlTvFckuhfSgJB56G5k/XHCRwabDEvbuoAYJknHn7IW6hVeCq3Q7ZeKqCgGRW2O8Qr+tcq4xPoJjHnV1J9W5vE5CeDYcnsqWLRugQyEHt1cd8P0bs2aVYgSuiXwdUHPaSeRz2vm1GslL4VKxbu/z3HZMm30tnMDgsTWjRDBoYa53fqm2WSLxJP4rClaBBr9HmCJOzEUxZ7RY5ehkyjXW78ztMZyGDSurju2Oy18i2Yul/zY/qaW2pkV3XY5C1ntI+7Vxs9ZopupwQAFq4nBDLjHBDhzmcUYOpy6XXFHzdxsUxL6CSB+9y6+BXxN3sFop+K1NY6vPOxxu4tkRLjhjTZ52Lc/Xm+Z4N09ltw7RYQt6vGydFkp0uhy7/2/BoNvq4gyQxtsqcjHr61sqOQsZPsu0TPsuh1ZfShkdGnwKWuc6BdQSzaS5KCwO6cXtq7iQ5cEwY/y+FoUICi5OnLFkPxW9OJNm60rcy55Pm/TnWk5wpQSJ110Ef5YeAR2gVvU6WScXQd2bdO2v8SoQE3xL+TCIX1RD55bYXQgreXXDyyi+U6mMsHQDbY2x33MBd7v4dX60J5e2eLybu3mHPgNMETZu68Uq4nzqWIGZRZaWUkBh7kFrCxGvpF3wt8Rc/IvR6kEJ4sZyMfRoNpudDiqIWquC7KkuRA2bcRaWotlQGiWKQyFy59pdfmyVIbgSyXC7VFOmT2aK0SARMBbNVWm68rHDkRYSfNjPL56z3p6HIiZFeYcMpotOYju4mnr+yu+nCZsuNm8DPF4yt+UxiC7UUBYqWRx94RM4B9zsboeyvmBw5TtKUM5elOaSqiFTUdV2u25BxuJ0FLIOAZPU68IojIP7HSt1jEsNfzBu6zZtjVxEqN+QdSSjb6EAAjcBSbiKyM8jOxPLVMLgJiRW04KgqPm2+dZImxlYuoOT+hh1w2ohMlFld0tSAg5kn/UfrY/92Fj+KuB53Nyw1zL5Bc5O0hkm41KJjZMZTRWlMnwphThqJuo6f/0DejbIMIaDded4a4jv/efuQZikwSWl2RQXDQnHvzcdlji998TWnFRmrIcnPX96lNUmKmxk4haQXd2t6bX10/Y1Pt82cIvytMKO/hK/zHJN/fT+jSUfnyJ/j0fpx247M7ocZHskHm2yANXSanhOqpmHIR5sXwEgaz5lRIx0X/Kaf2pN2wAujD4WU5AT6bNS2WEBzoyuEe2fAmwdIIYHCyQtCtu77P7BLNozWLto4emUy/WYqBVfLe5qB4jKEKJPngejHDXvGKhjhLu49TeheNGd/j8D8sGbIqk/TlJXv/cuwXeSOQlWfncPBFY94J/th4nm/bIMDgfwfH/jERMY6sc60+AATQTb98OzbCnBLzidYiSyrOND8fn/l15zFt9f0gnVdgVuZlVVh7SE7gL0bCcbXnClncBzAySlC0ifEgjgbqodArKH/sGWX3ZyWT+d8qD3ce6db1UZJuetrrm8hwhvCukqOn6H0qGekqzkJAjo8aGlaza2U70LAmXSjTzjsm43F9drzgbbXUWSFerDatqXdP6XRYFGGL+umZCi3wu99ffdVlo2mxKshV12DY2trFN+K7U1Pv8RswwK6+tw0pfBseChojP9B5zaPOL9pBwAivC9iX+hw3nfMc5x/0WafkFsApBoDlXt4B5B4BqS0C1ABuv/2zzFofVFFIVklWI8XzQ4UsR04Drr+S2/DxJaqonF1r8KV+Tc1qx7XbzG5igKhP9NrnDGGe1Yh60aIAExi07r92dhM6d0aYZS1xVu0V383r1Z8rwA7omeBIuu1GEU1h5OcDEmq4og40WDzJmIkWGVizSfm0an6EtJK4F81JrwZek5djkkNIHrBK3CnBQ+wJ24wI32kgho4xtEpLGQIpKVRIM7E/8x5BJTeAJlcUl6tGYkoNViN6bEKBd/S5WvIRDRHQW5GDwdqmdctxMGdQgb2rpcy5zAmS19D+KljYJwo0ZOfdMqsStTp4WbiP0ZUcJx27GNekjMzfh/SVW16dUHYAhGO1bdwlNRuig+cU6cE5rH+jExMfqjNWnW2avlaikTbjehO13yL2GxKXPgCkFaI1TITP4Wo36S/Sw9/dZZ+qWLZoJr/IoHwQl10SZXPcdaSnZKeSy//9b2ZIxU/jCEHr979iqAiZxoacjmCNuO9CdEZCD3PKh5prQGkvNhQalZ5PHBBWHElyiVXGnagPgDo5ZI5askoA3J54dD1PBtD5eW0bcz20wtUBNF7Ee3d+FLnuv/lyxLV878tgImRJPOaF3fzVuIPzjKthnLP+2omuELp0Qn0S4IdVLoRQONAD82X+9hrO5xlhlqDaQ8QEYrS1XKxi4HK0zMEL6nYuClJDip8sb1KcutoqwIstNGUz38mHmXF06kU4+9aVcAl3C/M6pgYfXaS2/QnYAiSbQqyLf7fRavsERhgYw5ezY+z98AoMyxMSqvYsVXCK9ZP3jfhYXo+1g2xDuwDv2uoRp5LQbG8a+KbMsfXnaulwab6K6Wt15a5nERDoqXJK2AScTzm54vz010gRjhpf3P3LApvHKk3fm58vCL14eMMJGGuvEP6nuycnjL5g7pL1Mrl6GRgtmHA9yEm/kudifcPoH+5NEKL5vRUd+QXrM+qhRFWKobyGFpOr+OeYg1saEE4e6LD15rnlUX+CO3yKqp8eRnpgY/40BoIjRDc2VgmPPf70wlxrw60wbicqG8GzD8KDfhqF1HfSspfGnOhlPoQVxDWkeMcgoLiWpApSG9C3Gm8E6FPOdnsUtz7RTkAOk7SmYI5lrg4SumqQ8b4QUIu+Fk75CVQcRxRtpQ01oYkEvHj915FiKH0pgyRGzkl2GVBGFUtKPT+hTF0JDuE5/w3CKcMysdI7YVp5V7hDTojwIpMHR3/FRzuQOGsNhV01+O38fHqPvKgDJqpnbzhWTjdlARfk6rjCU1kWyiG4tt0N0pLsd0xxo/RWUXmU/ec4Tl7VrVa7v+sUSBfAE/6o91U9tCW47sRe2cQJuxLHXRV8BLwY7z5RjthOsyEDqHkcxDuMkVQaRkSm61MitEbWX/qDDG7xc01ice8ItLlsWAnRlZ0fQVU/YkWmDV0bkpV0TbpUTiwHlfrRSwuzCXaD7Oj1QkVirXru4l0cksPVv5NO2UDKTW2mJ/z7VTijxClMjC0oNQ3juR5p6Z/F71uQVB8jJWevQVTTlh0E1Z4/N8c0QaKsm4cRT8EPbVY58yxN5RrGzDH6qjxdW/GoHFwR42CagpeeTYko/Gz2BrbmkcXGDH/X/bSv2cqfdZ214hk/5dJcB17/sSlr+RHxF6KDAJNEPvlHZcjAMHVN1I7P5sCHs4Hv4OMFHqzS009oWhWmELmpDRgNOylIFdxU2oA0VJDZC55MYfORU6nTkfdBF2BL9MjoXrUqkNpVPlzyEpv35hZOQLpJvZ5pveMkxSPz3RQONTN6g/kKMgcgSqFyruvNxua3/YKr+nY9vJ4ytyJk1K0NMCZG4sQObbL6R32MRAkWGSzjwvIHzn24RQLxl+ReSk1yWJ7xm/hSIbhj1CxhuThz3YobvaIOZS2nngn/R5KxVqmC4LwRRHR5yEa6TpCCMD+oR5NxYL7j46SKxlQIVoOOq/D5RNvjvq1ff5iv40GXPApX0VroZ8z5WVJPnHq4BIAm9yPV509J19+l7fN6n9BAXwuROHsFTN3DLTTewdNuTmnNoFRqD7pI2DPCGK7A/bVrPTU1YqEtQr1xbOj9LDZbsRv6dKR5VcV/UC0axfQJVj5xLZMaQHnpG/neY6mAxJ7jmBan94R/K1pWtfQ6fuzG79cBbtDVRrFv2NX64OZmm3Us/4exJd4GEXSxl5xos6Xyy1p5cLXVFj5029rr34CVJ2jugBnf3dlSi7u9p6L0lLi3hRPEI/sMjVM7Xc5k2OgXn2tAmlZ2hvWXH72vCBVO18uZiRekQ3I8vYb/aktXMkO+ameHNQJckKnDaJOAZTxzCMvU/Z4fhGKi8TvjfaR3e2cG9TUVAtAt61GVMELSHO6xTihXLmF6lBFINBdr3uddgFHbOJ3h6VM56ioYWKnXK4aGYfWJg+aJd4N3568tL0oEMrEDueySeeZuUGhaehY7wbZVZm2D6XZwJDz7s2E9SKQ9YGFwpoyCNXa8i/lVg0zAfVQ7wCQ0XuolTIzZsjNasDeSoqQ3uMf+zu/oNF2hu8I2+4+QrG/JXbWzWpTd6NPuRnYC8WysBMZ7ws8Ozz+XmVB0MBy2WKCK5TERME+rpTAH4wmIfZq7EAEat3QCpB+tj3n6FxZvfjwsvJgdyPJcRX0isA5uOmyegGR5Kq6rkLne07LVopW6Wn81br41SfyYktuA53HAAGE2grTRzfQ4mbzewGgUPotI2QNWf0fUdVSFqxldos85N7isiKGyFvhSRoTA4jI31JnRWSN7wDQIo7I1Ds2s4j4Hkmr6bhnqoCmXiIq2tGe70P99n03bMqwGzUhIEN/k613VlW2lGpALnJxtFNEsV2zcfzYs2PbjcyBV+gitHxO3sWENAkx3VLhiArc9dGa7BVx7sX9IvTiqeEpjtmedtolP9LeAzzkbdYEvbsZATjUHUmCYTT60s4UkuQRdUEMmif3MVjMbYloklU6fvjaIqt8jBfuxNPY54HanoTnJyV8MTUH9dUZWGKyMF4ihpA6BH1WptHjQwdJvcseqE4wuTNkI4yDS5A4WP/amsDJ/K7Vy9oxEJLXpHUlDCZtmVW2fyUbzPepFGo1ZLyw5GKZIS+qStWxzo1hS6C/1fyJjivw0Syd3txAywUn0CcPektTfJ3f9k3C2ul28nlA8S8aaQRKIvrd5XF78Rc+NEED0rWWPS+uzxMsYAsHj719BLSD/dn5CnLIBoi6vwZUC5sdDSNI91ruXK6bmX/b1AKbToj1JWbzqYByoCe56XqKhyk6E32LtDlS6hqtTP977aGxOLO6SE4eTPaV75jRyXFETak50XY9cF2ecVUTSJdran5BXKtxIAWHoZ0yE7zzR0ob1kz2QI8lMaQqBuZQX4YWFkuSSFCGneENDCVrh1MInuQkYifQ4Mv5EGNDg2DuYil9y9pay9+I6xEOwt702ysC0Of4uUTBJ95bqOuN0QfaEQl2NiU04GZ88TjLZaX8ayY6Fen0i631wxr3Ea1IKtwscFjrqUHjSmj5bNfYflO0wCkBo1/61ocDjla1awANAd3q0KWNmSLAmZRhCEppsEacTQvVJuLeyHi4Je7oOFWNoljzfTUKQ2t9TB7lNrI6sKRwK0sNRShwrlGgBhj7VyRTDKAqjGZbhkpAfklOQGQiMFT13ujqvUNzeYKu7DFjbVO0LARtjh8jmwCW+Rx+1XkLwv3/aocgdgK/zwOMtUrijnj3Fmze68bkOay9PCs6z1rOyvziEKveSOEz0bg8nTkK00jhgBQtLjYwn9yI3A32PPccNznUIJYZ27YRXN+wgzXd/FCOnbYS0oyaZoQ4muzyQeqeh9ZeiaEadDVYQmFRA0k1oIXC0kAkIkuGfRVkvxjZgI4RlN5p7CCC+tNMDO8RWGkNHOsmrhDrr0li/ZWyCL5TgxGABFkHsGthmxGwMAkXtkbdjseiGy6ep3E5FxhjJYPImQAnkd956N0Fwz/dkSlNBsxoK20YWbCCIyEXuZGtMZNrXlc+SWcGUxcm/J/lW0ADgO1h3s3RQc/6kfR5keqcGNp0WchyCV5+3pD91ogrNe7cvX++bAz6If3m1AMzp5fP1IEZoYG93J4bUtUnXvm1TzH/EciSJdwOuoMlwPkRjbXjLuGEHQGcfy7TdjLvIONxqykm9NOQwemw7+mspu+UmE6k4+aZ8Yj2NjNOHmSKNED6jUXWt80jsjQbSlxF32CkuWFJGv7ncxJc7vUBci/7GI8/flVdpIKE2Hgy6kbIBY6RaS7mlsgoO2cqBadB4b1OdqFOVT7+/T42OiPu4vfZ3JG27gt6ukChscZRHjWAVnvg4hHJyORlyKcBaV1TP5efrMQRS4AvXaqKCbzkZKebBmjfGUkTuFxhnVBjRBojnf/EP5+ZUJfpZIGFt3ahNmPhTMom9tOD3rmVOEav59XZuKRjPbaH3HAzTP6teAPSe/+tAvcLS/Ybh0AACU83bw/foS4CoAVYlaLLyD+En7kI5l3CNMsh3UWKhxEMO+PDUCIQK8Aj8r6BybWXEv4XQiLl6ZVwrogCSEq4MD3MPDL5mVq2CLeHt1YEYGiT4VcHEt7jI7upItVVLC3Vnii8LuKJsMTXTkxLREcSE+OikyagTObYTic+bSySPB9Iev1yLbg+GkjLfS1IEinY9JmZcWjnIUXaKIX5TPXbrHIQz4umRwcgUYXChsDWFpx737uw3y1x+NHgyATy3XCPgpeMTMlVZG77Enkq0S0aLne14l3MF1Nap4fsDkA01KY17HuKQmwj9xY+JQth/EQ5Eo4RYYB2rAVdRC8B5w871COQm8yxKPQQSkA2UPldgHH7cb254eAwdnTfiFd8h92LtfHCdmQ0uW2YPbufv/9HeU8UIIaU1uEPfFdWRjYqGC5QXHr7TIF/XwB69HV41X0467ROGBqZ1iohmzc+h8QQ2KSUh2S2Zc1n7SFy+xayKhrMdH8TVyXi5vAs18QuvCSc57RGv8hdm4cTmZq/CtAnS2+b7AP0B+CvX/fCzaFsfFj9JTHnrTsnoVMaZb3do0uSsfYYJ5ZcAT7aLmxPklF4XvDRYAxCVRePfdqJ8IGXScZeex2ni1HYPvHnAcp57j5Y0yEXG/ADO81wdqyK3bde/vadEDI5pOr2X2NJnMkwWGS4dAFhqujlQd3bMJIVD+bDcaj+3B78frip5RPDCbgjQwV8r/TD//p1xnaveKR9AtbbUVDzh6VuUyRMr70j5OS4HkzDUPT3UE4tR1D0S9gV5w2XJ6HWA99K54yiGtxvDsGzk8UrnMFufmKoFoIdeqiP63mOQQe6/kXKcsMFJMU5sr2uc7kPZnNA+/WUEeuU2kNtu2Lgi7aTQNUevq/h7C0aKMm6mc1nQMICJn7gF0CJkQeXqGV8JVAAatrNOf7tOdsiY4ttxVLWhfk1yJ/NVxObY3iJgFgFcIUNUzbX+A8F22jhYrqzh6b7vH+aqXHv2HnWEbUf68WJWqgvDR3EXPg4+HFlm87Cge0HHouso6zFlYJ0DJ/SkwQOELv+skZnYkP8pGz2cYQHOKNy/uHs6aXVkftt9TZc0pW8v27QQDIl/7YZijxjsQvsfVSWiUYwL7FN2HeRUZ3z6+wuLeaD4fHp+fVnOZArX4pBAxpgcaF7+NwzLIjPLWSBsWDsKEwtHh0m05UHR8SR2qks2gIFE4o1KBrIdqksPAV52i6OVyJJV9BmhNllmeePvX8HZxpQ9BQVM38aaDP9KG6Zop6qT2M0t/3rRy/GuXtKtjnO29dQA4wA7kUFniWmZsDmNU8JlFeabLrk2WpAgps/RpsEec/jzM3Z8+7zgZKmTBOLTnz//GycSKWp5kmn4XN48vjN3+JTSaEAtkEoOqoi8LpoN/ASLXSC5weUv2wDhaPBcteXyz/dlVcUl6zlI6pW6fQAJs58ohlP7ud+SvdEP/BK+V6kqWBwXwdZLcAjDiSJt8TkX7/M68IqLX+UDRYKAtRcO3EHlV58yebSJJ93Kg8FC9jJSttr3F9eFZ0t9AOWp0DJuRM+ZXX/HhoWhb1mAuT3QFrFcbmR/7Y5bhFukpVG/eUFq76bTjQLDAdeyN8HNoywrdYWchYDhFQgM0dIZTrIMXDPaCcxW4AFGaboheyZP6qnkKeiaa8OJmIwzyB7lD0AYx5ijXG7FZUfecDgfFePyMKUtVd3AEICcLdBO8t4f7jxrdw3mSCi3bieOnxwgbTPTVw5ZQpYtJHsWuj4bwer0cih1o0G9RDX6rxh7r/BNrp6EZPpJ3vauAhb9Rf3RkSrZ78BVwYKMAbp1dEhgwcDugh5omdQs07WZiJbEq0oIoJ2dKeHIllMtWfGhbdrBpK20YhQunMA0me56B8o1TY00zc9vLilIdJesOkvzoqa630T4nxvz/IpWRwA83dXZ+dJ8eHXhE35BnQlJGKfLf75tjNcCHn9LC+mmaXWgStZjmjAikcTkvXMBr4BFfeLbPMviOZVPJ+bRDMeZtJ/nDDzCRDRLn+JLr07f3xqKHb9KCAPuGeuofVwZ5mrWoxs9jmMJB1d80mtFE1zteV8M5h6uS+paayR/EGda3yQyw6W9EIF444sA8RH08YwY6omNLGAH1nT92E3WJ2A5xYgWYWuOos0+R49PVMFzvLdEywt5gLpUG7ZfTSdumUOmcZ0Osklk/73e6L9GrYg+Tgkn1r076fRRSwPJiSqwc3ZlRwFi4RoFzp/we51Rum0jOrBJKzeHeiS/tvLo4uO3bu9TI/la6Zzig/iQ5Qq387VmrSZLnuBrdTU5cn+UKoHjHRHGxvcwG1q1JSOi27wIT01oXZKO3sdmJcdcXrxsl27gYIIgNzwRLgrKrfLrnQH/2eBwPi5y3H6BU3IJRD2QDus3cR6jDgX85nQcFjPvgJpkk5U9HA4tIrcCqqm+a4XrfKC5lVMXrZytcZ/k30DzxersekeUwI8V9C8zW/XZ6JZQ7rNGxOcxJDyGFUOpYaQyfhGvuPkm834UgEpg7MzpVNv26hsdv/PCYTxhtvyPpTikQZMej3nyITo829lavUjg+5zohftSHNLB2nXDLzLL45fl9JvzgOC69TTkjGnWlSrJOkuxt9WK5Ga3+3He5JQ3TmGum+FyDESkPxSflHRpMf3SVnBThG+r1dG2TU0EKD7O5rLTkVU7WfK/8GJGOPwqLKYMHQ7SvVpxjrrnx1iw1hqBLUP9+6coIPSSv2qKPQQI0FC/V6CNmmy/msJCeHAdImPN/J5JNEJqYJmZlALlRjuJsYoslL4mw8tuLHIUurJ9UAvMtRsYDcf5vhnH2vOtCaSNvP18JSL5yHzdN379AtaORbFbHllO93TqBk2MYHG+207GuCRH2d90reZYD1dE7p0L07SqgOa5fb2nLhXqFeXXufXeK7FiyeJd8QMHrlA/QUZKQBdmzjwjDCV5NVs8PwoB3SeaMhjuyN6Pnw6I0OBDqz2cv9q+5Xrf2eBO1zflLabFtRRPCgSpRqSTi+qrD4Vx+2M1NizJHVM1moxMseCmmzPdcTTIWX01GvV67ws0OkXBWXCnD0zHrHpOayvsyoOsa0Q5wdyipDKUAa7dju1cEZq76wggxE3zOgy2p8LOEr8ESZfY5aaWflC53ghS2ospjb5nybY+QDQ7Yd45TOO5JuJB2xgaXQJZhAzv9B8Vbg+aW6Nru5e0fG+B9Ywz5Rb+kAgynIlK/dAMZ3k3fwnbx8LPGzU+UPkrOSwm0M/1vUpldFvqps1RYxgcgVJJZDuEdkSn6td0d5rRIZ+LuthDORb/D9nPm+ZX5tCPOOeIfTp4nNJ4P5fwOjHUbDpZsaPY/1t+17QUNAOya2VSFSrIxLFvct6UKlNwtJT6rtlfB/xZrTd5E36WQup4gTZ4/kaMPXOYjaUsuRxptZlw3+NeWBro1Y2ZdoAyuURjmMO9AmhHpw/CBefIElaoF/GnNQ5dqyFIXYUuvd9OYuQq49angW8tvje/FUP29yDaSgVovALDmRbYTeh3eC4ccVGQ0q64G4cjGdGq+GMlM1Jyvmc8vxL5ArSajUWsEnK63191fWKbWwZtAOghMJISTO3vErkNWLQIzhN2uCYVt3yFIvA1SC0Y8b3dC1b+D2p6KFRw+nfyW6qVBjDjlfNjonTgYAAhPbw9Not8enF8nskh0Lw2IYbdVx43W0h8AJ/t5azISBozAHs2PxxUDOUlJ489p6D8CnB6oxl6la3BFq+lU+L0kETAfOpUOyTd7wf3zJ5rpywZjQ4+F+cJQp0TRHccrusFFHLxDB3to1X3xdSXaQDeGoTENLZGiiPoJHuAaosp4qMDxjHpuCk+JgQsYcHFCSA2K096OV+nsiC9eHBGOGba5Lln9LU9BHIN4X4SxFTl7Dp8rlZo5LQrTFaxv6ismBP4d1+gwRQr4Js2JXKYqwdQ0K6N0/YOD3QDGSShYec7Elw/L5jsEQGYq51RJ1KjJuNenikARzyiM7SfslTPCBvoXD2joOibE0nPH1GS6NTWXwMYL1SqzeBkQNg6/dXsaaZoRXOxT0VY7PSe0xb+6lrcpv6jaNubQV+F/pDsqnDr10lM1ytBoNMxK9a4mBm20FSB0rbjOWzzVcxnIQP2xqRgmFOvju87sQjJb8qbIIUhSTJu5rCWvGWdVXeghiHdZ59pH6TtcOuVDkR4a2SpR2FfDOAemK5jM39VtulU1Oxk1T7zFfmneuPiXV9O9gUFayUb99uKyf9RGZjh01UXq5b74s8wVdfxVsyMnbg5ZnYAq9rob7r3//N7hi7mdpMo7qg0uM1YmxM5azMc+ISHQooH7dqC2W8Zj+Wzzpe3zhpFSTrGtMXXkSQH9eTZ0ux197F/Fe//6vNthOJD6dhcplUEgWddPjpXUwL4+XMGPb/V4VoNIbqUXui1V9C6AA5gqZqfw81lY/hkTSDOeeVCBCWC4SXR1G9F/rrzJHj7XuLgoZgFl3ONMNLDkSyLMJ60bX6v+Wz8V1E7dKC39p/yHP6Zv0zvm4mJiYvQjhcKMV9dzGg3AM2rX7hql0NmxYT1joPBMupxbQlRjAow8DqQIV2WQ+bdm1wyfmaltAiS+b8OLrz61hxObEvnbBxrYO5QDPbD7POdhTFlEEAJZ16jNN8odJkc0tOznPHyS9Aclyks2oF3pd0XD8hzuOjZqU3ZZefevVwJ5n1OWOujWywiX9uQF4k8LP7IfNGPbVyYQsTV9Nl43XR4dReBpPWSE4OEwsCOXfjxzpbWl9F/kDH9YhIEU+bk5XmUG6KQviv592GVhNvcFQ49WzznoWAXoNQGJJzAew08baQUHOr6GBScvkIGXCcFRDxOXlNsPsBhfUznJ+sBFl0f6lXWknfGIkt5CxbYbCKdwg0WJ2NnEYOfVTHqCLdol45ExJbuuRPQrSBGR1vBe88qwiKRP8qH/lee41BlwJGNQXPNtbLXFThv/FjAurY0NPl3sw9DHFF+nDgbx2PbN6jhKQ0C5SG7Ba98KCZwANSLvSUNUg3RSAiFsGB1y9ZYic73ThHbqGx3j9fBv6kEYWNtHnUCeqhewmBoC1DWkfoa3bUspuBHGUF6v0UtNBqlcVl6KE1UavskTd8Ur8VGBFJj9vub9C18dgKx3A7ZFDX86Eqjn4oEXoSTm/C+5P7QIUEDxUVs/N9d1tT5QSm0noLKO74Q8DCqvPLhdPl4p6DMUp8LWrFMrguwSgd+YOTCRjPpTbkKLaX7oSZmATFcV+bADGOol37E8w0t4gh1DhnCAvYYOiyMYSOjVqzXnK9BCS1NQJnWv4CG/88gQICOofBW85nPL4I8OABmAyV1rkUEoJxEM0lUOzNLQsRJojh3ZtxP5G0a8MT0/7883fiEhxECM4/k1BmDJWMRleRmQK79PgZTHK1aN+NHONw9WEe2t2l1yRxkpPS62HdnHh8hc4elMM+9VnUSuJFj8n5tOnWFVdhAPuYVYgQFjKxDjkQtqUSVvz0hA1USoCWRaFqMBneM0vcB0W9jXh7y2YMcREY7HjgwCuNBXbOH+a+G8gDRw9X4oiJahY/tUJ2Rv/iAiDNJOYnXZLMHhLJi07m5poh3vwLUyPDkTHIw3nnl61SvpY3oa/9ggUaI2u4CYenKLeU52IETaMLL6Us8k7FCZe2Lvs6G6JSafPgalg8ty76066XPlnZ3oZUd6Lxa1qS4sF2iVYwZWrO32jqEnkxppyZ51Ln6epG0EFuOsFdu+ZljkkAVwv8Y+2aXWUH7PBDjCxiaJfbtsWqSsxro3k7dDsLxPv1myvpaCBkQvP/2ecab2fLZ5CSw82HUySiF4vqHQYw3mMShSvwSm974dwLZfn7hb4z3znB/NcmeaKmTzT7eU8GBc4B9KntOJEGmx0gJmoC+RQj2hrqRcDnmx+xozqKlG1LbQ4wM89hiNmq5LpqbDPUiW4+iUzz++slSwgaajHGRkbns6n1Eq6fu/aPbMKdYat4+WzOZKPEBzfaunYYd8Cosd0vVgcLzjjvJuOr++mvuUjpVxkVKuuYGPo8JQVf//hLjXUsL6oo1oXGxrgqFfo8Lu43n8kZvAbDqN/ZipVKRgEh7Fb5Q302DMjontB0bFjcFr3t6he8s5jX/HpCDJPwFk2uEv+y0jgTac571q8LBIpAOSRx+NGgMywMSOQWrIfm367I4AO/wbV4uKrO28ZkJrZAFV5IZ88zFjr8uV81C+vsoPnZS0SQ50yDn8OrsPM0Q/8J2dAnEHC5uL413JqdXgm1e/SlUhB8G3dWKvUrcfzpX1NjQbT2jECMl9eckdh9oy6SIZCZuEH/e7AsSkKJVQ+Bte68IwRMoYXQ8ZUbOp/5yzwkQZ1ivmja0irLUGdshkmcmEQeXq/nU3C/aVvlDJBjfXMdvf1mj1mJgOkx8AdYPPLtCdGZZd0ZRjSeflzIntOciCZk07NGgat396JSrw3Jutb3RJHq/3lwzIWpip+uSt80YeTNuTk4eo/qkmuLP44mNm9bUSCV0GcuuGXC+xihK9/p6t141JHrq3IuQsX8UtLnn1eTqry06g5agf10XNF+DASGqOFmtlNBDxc5j0FKgsQYrAx1FUiMbckH5CuxojayzI8ncGqGyt508S6sfIdBkB8pJSy77FFPB57Fe+Tc+7dO5r6feflS+MWR3D9kRNspJO5pjSVjgUtR3O/QI9kYOuUe1awS7L5CDWYYSm2nW0AqDrJGBsxUmiCgZ2WCM7iAOpCkMOJejbo4Fu+fb1y0dyRi1uxcd4V8SWDioBf6TiFo9UT1RsXWIMhbfmbGLXYiRxlgH5+I48bCqWnrEA76MSe2YE0UBhK7pqCILxoWZG9sNkiIl4jM2P9cgkf41Qr6pYS9ar8Xs6CsT314k+hilV8XYi0iWqPzwmo/UGQOWZ5Y4TJDt3hkNbOLcUfhS1Jahtrk0Vs7qoTUqgS7Xx/JdwWE3jq77OtHbTkqSfyeMefDUZcf9mykMb/JPZlNlrj6tZKbXcBLURWSUTKr9SBN4yvAeuL58LTdM38vw0SLzeUmEX20ck9cxw4vd/e5gUyedDyfplE11f14FxZe0eQS4bh8+qwRKGmkX2jXgFMo7DcqpRT5j37WK3hCwXk1q9aFeDpfFZiSwPnJ98D7OUkIMQiXukeXDX71Ch/FoaapWgf8BDEseOBFT2aob5V+3DdREreTnwdHMthSKXJY2p6/qRB6zMGcUgy1CSPBwk/6xZUTZjq1Km9m+IJmegVlDBCopUOkWtptB7fNNzNXtHUrGytpa2yway0T8gl26oMu3PJSDVuvxJOfSKeXcPrPdsm4zAaBN6tMfjR6NPDqZs8pu89ssE2GBr9S2Smc7ODeGy8cNzYcTTS3vra+qeDec8+5m2PmlrieE8bRgy38AK159gJSX3PU1jPXtnk5BqaIQ0JHu3WwRdK4242oIl7izzNk/IXGhb0Fm483sZJUBKi0NjFb06FCStsLJoN9xvwjsv6QTXjuIZUrtO/jQ8QffO2E9ab+GXUEL6awAMtoPuWaVavbaxdxRSlsMeeodhp0HcMNsRIFKsUY+ABRlHDFc9mSKwF4pdh1TZyG4fIEIw/lxKPcaIEk6GGmAusxwpkWwyycwOojLRkD3Y3WYly5a7dp/wjkXuEKDWD43G18mMf+QCuPqowVTzQl+b2n8WhT5R51cWWel1SES4Uz8Tx6A9fwuhLoUwsqz5i06Ole5DqrPi614IqOA76smzuaodXfzD6quOevt2oToWS+oOhD91Bpa1q2orIQnydMZl5BpLM0INc1u1yzRkswQ8XIvEuRr7rhExPrnhfUhgfmKSo9VrS5jAtaRKzkgeTSXUswidXwY5fzCeOLzGYUhspF74+NSK4pSXaEv17AJV78oV2MX0kDiZMzg55n+9ruD7ncp0kxJ/qQFGpDtEVk4I1oMldEloWvANQH7aJNE9u00cepy9KiPEDbwgXL9yCq/gWH1naaYN/ZxTU7mK7LZq+V9OOB4488KNSVl+CBJFbSmbQA2rPdH83GMOvJ7yvdiEsQCs8TeDwSQNox5dEFthkbOl67V/7OCc9c0GeTC2FJQWHCfrjaED/DtvCe6e1HhIKp/3STaVTA01cTxozcW42UtOZ3Sprcpm/6jv0Xbp5kSjs8q9Z4nQiMJhlrOKBpfYu82T0jfoPIrpeFHokx7K0coCkpHdVyFqZV+N/ZSQa7S9g/NFXj+r0cvtP4PT4iVPL6Jszf0dP7InRaFteTaVrgga4lcGPwo7vD5eL/s2X0qnzvg6Y8ZjgEM1wr2paIXWycEKD6lQK76n705PTQcLtRdOvv7IyDPur9UC8uqxBlC3JCOW+bNmUiWyfGKlA7lOPJfMBxEDOyGvLG1diu4347CwsCkiLx831xNutZ5NupfugN8W9tu+tIIfWZbgzowFBTjBheRf4II4vWHAESWVg+uKLcdtu0h6Pt9qB3zepVbZ9WpO+U+CF/PU7YroWbpQZu4tGhuG75rs8pD9m8CZmiIhA9joJ39Xk5bp4IWt0QyEhU7L4VDhe2UVp9BmEvKBz96w8L38UhmTvDiG77tSzKPwCXkKMmzvCOEMk6O5MFEdtohqyr+jJmumG+NhSbbwSke00pufh72M+D7F8oQ4T4a8XDAItmKiFB/jEssakIVURUL2F+QnWbzUQdaNCDv9GdJqu48YU1fckNnsDAmo3nd5dSvK6xhixYEnV8v3gw6z8T5jrUI4kOhSWi77vi+yrXJYwL2q504dPg8ItIHrIaIQ0z65IVOBj+BTENmP1Zdk3UMEw5LU7I/IrAfpV9YX1uWm/Iuebn+z0+d1larEq7stobMN5x0+dCFa6Uq+66UoaC65bpM004HMeeMBW+Py7e4cAccnf5a66C2DqvZeW0EYh8TVA3oLjwThLT/ZOOeJM6D94RLuRw+irUtNTYdORHEspiD8sOZ6ayhAtX30K5hUInhkKPfPMxPmDQZpFo6GXt0l0WOzTL/1n1V5ag2eQ9Q/lQHA5t7FKfpXcKRR6hspZRajJTizw9JcjicEUvZTXrWaDhw0iJpx1CuPQiGh0VsTcaepobqBacRqpTGo7D+9Pb6HL2bQOjDefTlywjL28M/JAQBxEjtCvdLYKx4Y4Vv1jYX/JYOxhMPiNKJ3Dgr0sEjx3lQgG4DmQklV5xuFNBg3UFaomzwv3HUw/cPo7agm87giwCbZYWhAFmIjyKIFPXhOkQbZ3wCapdi6je5lsMzzLtQmcBZjReVC4XnJFI4fdZWjnI/l7DQOOVPbyVZJw4B+GHF+a+DIx4oB11tNXjc2zB8157d3s9esIMFW38ErkiT1+BXMEwj7vs0KKYZ4R9rYKs7M3PH2SfQeVtfXsAw3y1v6EBGWa+Df0YKJfQJEkTwsrDa6OkW2WHCBGTgtt0xgZztNQprvmczqfsq78pR1pGAWnexj81Xg3kRvpUcShiCuSLXSoKSOq9UV/sTqs9Y3t5steXoGmXRt48kpBzCrs7+7OGk6HkJD62X2hlY6zk9Dk2c4r3MOKpxQSWWPacvkez9HcmIILFZbWL5E/0KYhacyh0YtXUmpMx/M7KLhgcqguZgRhWjYr8cn52tVRhewibfi1qP9CqtF99SZbVROGAvIBku8cCAZEslmzngoZedSI7aLiK39WMFE742OAkcj7inqtSnI3gyRLioE5o90lF+ya2ETXjqrC6MCJFl8SiCaARnpcBP804UY9AMeeISZHf4yCs7KbDLniMQAtWUwCRwaRJ+Ps10lRMu2e8djgYZIl4BL6DSTmej+MyYVDfH+kqQq6Zb2UnLsni2NT3TQRWhExfGAjmKmx7LzpRVpcdy2zqgNuMKUW23JGKrwG5hRuK8/7s3dp3aLpVQPPYCFSxENDN2SvjbPmPoSg5m/I6r7tqNK9iYCeO1cLgnFB6VAlw020lYvBrxzXvO6HymWwgoMYFIMPhsBlA1RRvfDC0RXIX9vi4XMeKYutV7t8kChTXmwO3jNpC37xlxbJDrUBsMSfWuSJhH5rfUPjKM1khPbepssp8Y4PiXjPOKhu5urhHk/ejwgO0VnpIor0EJ+JEwIJx9VwNyeAv0vmYTO361opJXO2rygnyQYgzGlif7gWM/941QBjD+qBPyY58kTaijOBCvYXufoBfZiS2id2JK2BusqPlnJSlWEQeHN82hz7h4vkb2+/D9juucDerHMz9iV8Za1X4zh3h8FP/kPLeYg683WIqvD81WV1GFUuXxipkfDI/ZDl3uGqyaHhaOvpTv+OKLFUShQwdQl2AIVxjiVA5IgPfnQyi+1FDDxBfweKgBOvTDJKu8eO3Bnvfw3pFbC+N5cRJhrFAwN6jUjfHjI1W7yjehHq2OGYFGS6rBoGcURS/CP/pg6jIChT/A3p2WIiD5YlYXlGMoVAS2hTcTaCtACWTH5S+HswL/3IjQHlPJ+EJKAE1oXKcercijieraZEyT4fbsnzVFs8lKpAarz4B0D4JynshitzBHhXLazl6GJZ5auZtOw/+4WwVAo5t7ZNQZ3st9sh35Vp83M+DI7tMHA7K0MTIh5hmGxbJQsvBZnNklmXvjJZInRWfJcHX/eRhZ6jqiX7yM0MumG6q8WxHvMMe7gfN3VGA78m3czTTiwMe8xL1bUunl6H89q6DM/G/1RI5OIkYH6j79fnnzBPXNPu2hbNGz1B/lp0URYl7UMXRMfgbkIY5+I+WaKpaWEMM48EKXd03+oxqE3PTv5YJubqZPWrGTwJU/KmKiWalBIn8W6iZ/NywzdJuXR6fN3BN15Vd1X+swGzRx702GbrWjdztJH+8UrcFGN5AvjMkCcwsCIhc5NYtDRbdydcWZId5buCeop/KXcopyGWaATVl7QzFcpj5MDClyKJzMntNfhqssqF2ICi0qHk170efQSzIBp/Ta6DQO/wLcp4eqqqgR7/Hk+dtyzlB0qRMDVuj+PNu/B2pYnlFT8BT9QLTajU/JaVi5h3ST7AJxsGKoNemDZkTOKmTJCRyWy8csARyAClAA0LPYPNOv3QhnjG1FZdmmbtrrvFuT7JqSJtu1iS8vSoCzrclZqc5kc56l3pP4AJKCdUu/CmkhLr3YqBG77IgYXGjai/p2DSloTZ3i7DfgqMUKuWQGuaDyBEGCM/G2fm7UVDrmVkwm/DKeBuyHeTgLIXf/MEkxLalHn3ZqYiLybzYSpIyjf6yLkDILBJUfhW/nm22sRHPfvRVmNXa0O06BqKoY5k233HQKFvB0tzReHscU/8kgJQ1mx9NHkNN2HimWAz3O3b2+DCUWJYQ24nKFuezFmxnhsBFsirfk52uEb5tlQJf9SlUFB+ZsIruq6qUgTfJR1wdiAgpIF4vchRdmdqMA4C56bwsiOG2vOFsLIbMXpQQO+wInmW6OROLevhCG8izBQmZUYksAK1RY4fDiZjlHe7gYzSUSm9lnqzLIvejy86tLCaDL+JkEsL+cAnJMFCIhJnYM47Xw2kQ4V8Qmcbyv+w0PoWuYHR9ILopyfohvZzEunuq5+NeI9cfHJqTzLOcM5JWBguaQ5Bv+Jp1RUJ2GSs48N+26Ni91xqx6oENiiDIrRl347Q0equX7sIeru7XMbWa5s3BGq0qwcegkLn9BvZ+/QzKr+oAsmDpipcs8h22ULuqtMn4Ldg+aald9RkEbabMYj0Y+0sorzdy0TWTO05byN0iUTEngn5aA98vfu+tYZ6HirGqZ6n31CQVZL0FRJ+YUn067aOz0vfXHE5QolymvstNskmz0sZqIvogfAw4E35+2BCDeQghrzUYW86+ADL6QDJlxwfLKtXH9dNHC1kmxyz5I5naaihTdm6dkwM4Yro3T4PqrDKj/trFoCZ+N7Vc7BgTcBg5+7uXyEvjRy3vkqKshINR6KfL/3ucNoFRSR+XOw68N00OhR1kfQuwS9RZFaaMakO+wJIh0Phe94n9SgvGf57hrG2Mfis9fVb8WjaxUmvSaL9MgXGDlMmjEJ3q80r/TC5yg4MSwwJa9hnoaZ511gE43IKFA81SLBCssF9zh34D4ycjYMp7TY5hiBhsZQAbGj4gm8XoCon8LjB+vEXpDUkCqG6NvzJuLl+w2myTppJT0wdS0g1Vds0808lu6tDySx1B7kl3UQ3RcgrQQsAazEJtNPANSLA+NIjjon/UrKfAVXKCbBg6VLk/A5wf4ldm3YiDDiGC49TtomSfSzKpeBvtfH95J3/FdKGpdtqiJL6W94hIxBGbcmvp4etzzOgfLCYUyubYSwOuACmaG9FZSgz4+47iVl9TVlR2L9PFX3igun8CdXYcR1pjOztUSF+ayEKgzQNd1mMzP6cNwY0VT9QMW99n3lcmb5aPUReP5TZXCBBKDEf+ST15WNJefDtvA9Y3qSJLdGgo/WF42xXJhoYxiAZI9pRH3JBMF+JExuAjq4WWHDhciVk8B/byPxcDSt+Wb0Dv4Eg+ez3u6vqXI3mp6OcBP8a6wSXxjH6QRwM/wJZRbrBaAAv5QFy83YktEy+fs09lzrnDKCUDiznSDNJ+Ie6GrmJxwqZ67quwMJqCQX8oTVmMHbF91aRFI/KQd0wJdsMm3E3K/vo75EjH+SzxJyR7mWh+pbhiTD0KRsE28LUyD3eItZ3VkNG9yBlm16/GonP18QhQeHHi981N8dvSCczBnd013ogkZgn7heHA+QqF6rjl659eV14Ecmv/ctzoiVHiCovkcYqmt3O4EHZuv0MeF3mka2/B11GVQZ9lPx5+ItZZOoFcHcBqsp/9vv16ZXKXnqYBGsu15YkMGI+HOEgOWaQZJC9ZGAKcvFl7TFZTY/G5Cstb1//KZP+O2ASibSm/wuttfjD3FQf5bGC9UK5MjLjjIqtDnv0hFZx1cO3MAtJspcjcwy/rJyLooK6CASpLhhdLu0Z8uK+EOBXNY+kVoOvwQMjhigDOowXDdW4CL7qqWYQ24fh+J3jUaBeT8qph8o2Xcfj71saHKj+2umzO4isCtg2TPJuSAs5qx6q0QJrv7H6mmqR32xWT/V/0GNy/aZEL/dmfk67CeRfEFebs+v1Vtm87zR/7gaxR8+WJndblFIpiNX7BDhCblEyxKm8YEVQDfoxf9P1E2XTr8NHf57ZSbrn1zDmuja69m2KO0OyEcLUaekDpSR21a2n49kfHtL0sc/+t0RbQ6fjzSDWciXCGTOQ7UguqZWxvodUBaD4jKw2tCrZRqu13cW47acUzLn0jE+2/G9z1uIT8ZDdhwyp2g3Ny4nR8S/+bWWeiqN1NrlxTmX/Cffz10wYO37LRxVFCxzU5p541qvf9/WSS3QKIRY4mt9ctzQ6M5ggqp3QZNNT6lYBJl47xyNBDo5wttC1bH3NBpLvr2wTDI2r50qZiYy5LEHCiL2EEJWJSc69PCEjY/if+v+b/ekbl7POA8Lcrp/yL2YmgaB5vx//luC+NAux6ImGwptjYf9nzPaW3b9ymJPlXvr14mIQMr9X/k7WfjJ2lBRdbRAJa6MTmI1DToOsEJIV1vAX8n+WBrPHBXFKardgvK59c7GUcZLCd8NiqwsrIu44d2v5RupJKb28AF1/DIg906gt3hHTZ4Mr6cGIRA2eLWYmJLBOIBJnzTzTonJX0HaJUkW1lQQQBnLO1FnD7cD5Kp0DMEKfqF04wAnTeNWU6hC/KSzNntcHNnNXTbRAHX21tzdIQ5c9WPk3C97e7y97qAKVcXQ02ABaoKGHiprmEg1f43HNySlkFBTQxqrjp9a+3fGvCG6qGowpmHzyPwLB9xsthUyQk+vsw1Kuw1E1joUNYDAAc5rkZnfbb9AJibWnnwI59+OG/HctBC6mGGuqNBzG9i7HbJmmn4weD0ndeTdslAINeexVIGhyJXoaSJhE0yKXtUCSEd4CyPZr4lfxVDQIUhayV8ZjQqOFUTvcOGkXChGUnjnWuoNGLZMVhZv+S3W0gDZys9kLOmEAvcW0/Q94PnNHuYgv7dOmaaA7bkbix7rxQPAvbO++LDe/qln6Zxqg1gA8wIrc42C91YrmozXFHfpS0/NvsuREVKPKLOx72NNmfHht2mZ1MK+wCJ6p7bkNDMNyGn8Aru7aA4d329SjJyNgN3VIO+D3zQU+aDj96NWmw6qCl5tjSULDliqv+p+kkjUuOUGRRyIHqG/VRmaHlBTJcEy1wkm+8ceaIq+N61m+MAopa/QePR447K8TsJacQqZTZGtbMapDjDpiRyGgMbx+uyPGQugxeFu6MJw06FlMHQj+v8N6BEHGcpaBsoyXJvrJJZwc2+vA2rcen9gaVaKzjfsQz3pARBpjz/2Kd7aI8hXTlYSQ7bfn5jBuMJtml0iKJSFAAMiGQI6E8UAnmsKV1Y5JqEK009qdgzDCyqbfxqBfKxMsyb47uxso78Z9De9HPujzh84/CdIloyNc7L1QUsWboKd/EZ7P8h0VWBcR5ERizvyN/4/AVCwiDCieR0y0mPBxgEDIXgX3PsCYw/VlbErkexqav7XvTeNSVnvw51AE6vZZNlA3tKowfWC2A/eM0trWABPVnie8pnI9QaKku+m/j+WWjGcLtRrce+JQIwRUUm8OrXnD0iwUGup1xclyGUjAVEwJbXuOCgleQirU3BtG+M0y77gDs59mWmy/e4e//W1qFAW3nMueEOSD0uuEGAYBKWGcK8vUjfwt1bQrYvzhCuf6xs1BCRqEfyjRQ9lpqY3uI9DsKX7O3hbtPOSjqBq7M+kFfUzagTECgiUbbieOz7Voyoviq3Tin0MLnskInEjfVsPn65/+x3OnxiS8BdHExK4dnlBTyGwiQ51nksCWRE7GFXmJCVorAnVM/QT1vpKGMkVIspMiT7OJmm70Bi7dK0b0mAXINFif7oO0JtvjGiRbSK4Ik577YeNNmfD/AA3T/ys+w/1CY/3ABWxpQD9vBctZRAvjasT1RMdkRWMWWlnDDDswHsRF+gTXrqSkb6yY7vMIBnWb5UONl/4GN6eebfHDfBJ+F9VFiw8lvJvxH1i2ALVnC2O1HiLu3cQIWOzWpLmLyFXDYcEipQmEgkvRmMcMVwvX7QL/LnJOxpuY967kkZXyyBFpgCWEeX1mTeNpPwviUX/eJ/ICPEasarN9IRICgDaI1xnHMfIjz2NoP5/SszkIvwgQmBvk8uKf9OSiFEe6o5OsY+ZWwCxr/TdY5pNM0WcYR6CZRymSGMgSn6QP0L1zbnH2mhKdltG0/kmQo5lxlqFk1MU8VCtSSIun4LdqqNb2tud+eMNSTDH2fDPmTd1EkUSPOINgHUPYLUzdTp35bO25/lJAOeguh3p9G32td0WEPjC3f9YteXP4ErIpAReDBrTgHmGXHu1Q3jLyMu71NeKjDLcVhcYBbsaceNj0d6Cje9+yiWjgmRRPFVPTO8N6teNZD3LOcg/gQIxOt8XE+dMDsytmV2mlwJGdp8qkYgfXe0bge2WSxPDbztmymNV1aK4twUSrMVqyH2qtKWifOW3kvoI042fK/IuxmLG0obqyxtTSEYH6DjcV9zjbzHMJm6/j9mpcZnPFu4oWNhZrQ7gy/WhjbHYCQ/NPzLQ4AdJW1fcZbZSLRCNEdPFcnwsRSkHxbSnRAz3VzfsoU1Vxjy9fzTTARdik8vQdX6PrYWHvhIS6q/NxqGdOFKHPgaQDPbT5o0rY1hr9Oqo0TMMoATS+CI/FSyNjfynVem2HK5DpnkaCDDyF1kbOXY32pvEqQ1nlGu/x2w23kOUrgmCjFMjX/lbSkyKWh9bXvHRPOsTAfhzK/90svmEDPiU0BcB/rVi4FnsrIoR3Jwk34A6hfiXMo3QEcD9Kh7iOugeAuDPU0KFYd/RR4v3/zMV2LGiCheq3vbb80T5ayCdwLJN5cptMbr8yPsp+Z1lyG2jSS9libv17DeFH4/k5IYa4SkvHcsr5btAdX+27bvd9jtclqpC9731K4cu9FrmMq5q+uqFCQTqLnwPdk2R9mQM/AEZjdvguOrkEGzdpAdlpc9s6YJlvZd6seL7WNzORW4FKRUTx5d68mque20NCjsLJU+xfGWomHE6MtOGTKNsp1NhWEUQqgf9XlZ7ae0/0S6Bs6+YHN2gaQuu85k6o2UTOMgKyO+ogQpUWZZ4Av6kxtAytT2sltaiXGdKdLdE5LTkaR4t0gw4li1R8y3btJPK0oyIHJ1otOAkWlph4cTGlSGU4pTyd+8zWF6nx9qRG895+1e0OY4OFcDquCXx28B7AAO8bK0qNzCFY0xgHOU2Z1pbE2kK+4ZlJAEneqETDuV0mOQ0GEC5uoFlAPs1hlBal6pW5cqJ7NzeSckCMAeMTkw4m5n87aNN6yG++tPzw48mRbSWJHKlse8RefY/PyagFzLuSSjhEKJs09o8tOcv9Ccu/hSOzg/bfbdDxgW/YzjcUCV/qHz6TKQYDZH/qurqRccfVFw15WeAF84Otdllt5aJbibDp0mVdnI98ohO79VwZI8K+1p6jltMA/y6SBMjn2coEy9ylfwtOW9nAE9BGHN23iqnyP8e3e9PvYyrlrIF7D0amp8miyr6WtseD8ZGu9wK+MaS8zETKIgIh4LxSLTj9K6t07TOFhJdXdX0xbO8tf8wYFwZw6cDitIaT2fabVg13EGaQlGA9K5x/kWXGSfIUFK74Us1/Xo9Z979hrVebNKs1PPKItsE7xuaop0AWakbTpSYHnAe3/+nbQRkJcqfNvGVVwE+y+uBJklvnz91R1vzJQYo1E3fnYHXmljEBY44zg0Kq037PK12fDBiOsGGLKNSX/JYNLMau05d+2itHR1iB/3SQq7UMWyHcujVA2JMdf1t2hK3pMXS2i1lZus3Sm5x4DeY/5UyNiZT7BbN5GyBX/7EF+xEe+Hd/X4XMLcPE7sj6CLO0gNddtcluyMNGLuGb1kM/UynMbrfZuvkHES8OwcgWVQWRZeTrZhSx6U4IpJgNYZz3EMHIfmnhRn695tOoyKOeONcaEayAA2ssHDtZow+CFdJdNyZRnt8MA7QrCKPFV9+UysBjKUGnqHkFfDSzkg8g82Mc8xTcORvnaW1AHY1Tc7Sn+xvx0HAfM1jLvMl4Gg0OcZyuGqZ/YgcvjPEZqfmtPEX1KGB2KrjBxGE3zGkb6vWa+4EtZ5x6MNc3Dgpfw4QHHI24woje74fIYZq25MIszKxsOJWjwNPTlKthMkGZXTE+Vh4h9fwr1w8K22XG+vZbGgMypoD+TBm8ce4YC2w31QhDy4hHOyK4lcN4NbTSvyLb+exUqp11l+Di68U9/jlp1O3npAvUbiY9MkLx01RkrMqnjPMUhGxMI5aiRRxxTB09h5gJr7RN+GDQVuRAKYiEyPkwP4ey7dLwg0iE1+sKfcFrMsBVA1j4NxK1vx9koiFtEU9VegnwCyRcdWf42oJUh1K+imAjFVBnk0/MYOTaXgeZgW64QXgCij1rqI8Kya26/wkk+ua2DlqYwnMLbiNmde+kOcJcQaBWie0K1gMJZ6GpA+c9UWPdGdp+JGcKRXhxL3eFP/TqpA/IjBfJnidhK0It1Nf3HQ+/plMBsYk7nIoib4zb/Qdyi1w1usigWWh357EvgeiYQJasdVLWqE8f+E0o+uDTm8vXgd8bRNVTKP2t0sAx6TFLJoXtAUmMhPJu7yiVMe0FkOF9pd7HUrHKRwWPzKCSqwYTcNNTWiq93vcL8rAnZdflfbclXusMPFWzx339A8zZZlWfu90u99/z0gCc0vpkEwtxb04RHWG6aeuc9us27T1Dv+nhJXl8JtHzOyp7c1FqgmFc0NY5cNe5NmVy5lgGWgFDKHngIEqO+Up6WobOxN81bKV/JEUNAlQOgsgA11pcCoCp9vWARDnyOQxteVcd2aE/iJE1MtYEdf2fG1lob0Etphi5Mjd4hS22+qAOq680m/BaoAAS9gkjjelNTQj7A6HMvjf5rvU01e/2okulFTHhoPQJu+5r5/Bwa/0gIb72Tcx+CpMTzB//x7kXchPRbYtMd3qAzQsr6LZrHRIOcT+G/ho8BjbOg7NootFFXehLf13aM8tXIxmaPMX30+XN6Pckqon5/6Ur+qSqeP2Gz8QBHhz/jVdOq2Dq3AuwWLSoLbkIYIo9uNVvKhxCxpLWliyjnrET+PZC/6fktu52Rd2yvFMZLBjk059WlDajDpCfFKnFs31wBADwoOXDEb3GDj+QeHWcZq4UA7bOLMApfXtVMz3iqUN31MGAtpqqOlNKIbGwEx7twXvuem5mbrxdhxC5E4danDwnwq/K3rYMosSP+VrXEdTETAJ9CVaZvMoMg12473l7Ez92Uk+v/HHs6EpjAyplQLfx+nOJdTDNuv5hf6urLmDHdKjFGO/yqUJtQ6NhW/qV0Ve8b22JO7CUUGQF41NNTMoGkf68aU+qcT8Vas5VW1B59s9F5eqFgTQbJCiiDBYv91ZO9M8oI1klFqOwYJ5g0YCnmLlpx+yC/m7AnVio9P+FcbE2IdfugkxleZb5saUIbPzLT5I7NyjEeteSMfg/04Dvnn7q0iBbM8z0Sy/MvILCdsxquOppnOQ7ZGVPGi+CeOuEQNM6DMMtbWilpC0LrhszCVh7AA/UZpxP/M/afkkyxCnjaBwgIEOw63uylSPqHO9dYlQD/f3hjFBf6HzXetcCWcO8LuIziMoOpcniqGFquGdWrHk211jqSz4bqKu+osVUSHVuGToKL5XyymeeMr+EySkemVX7BK9BKPQdz2iiYvjYIZOvG3GE2jBLowD2CUhFXHYrYevmzy02rVVyhj08F6UEDY5zdelFw+FzvLI4WoWxaq1d9cbZkSiNdgRez9kAsDqHARuvgzPgVQMv3wKZiNmYBVCFC2bsEWLpDMAu6q+8XRoD0pUmzBXrosCkSiHaBLZxSrrIVm7PeRbMsGSKeut+XhCCy5qvalk9l7hx7+dFSLOqTDwAQyiq0AkKdWeZWUCjXsL91j60O9QRf+fqd6mbobVsVQyhXFo79byBpMaoR2pD8xm9em3qJrMYIq2bESR1nENCGT5Ieo+3rn+Jmrj+jfaOPj7uFpa/Ywp3iPmYBfNbwfgODbXheXkEkqu0UlzC1jGsbY9+bbnQZKfUBz8MV9n5rFBZsA+aWghoiSV3l/lGpNCNJCOWGV/InR3Yuav7f/jHRTj8Ti716P7TbzuXDASRHyat9JQA8RPqCa9+uYtZACyIN2Ne6b+idjPnk7IS6j4PLMMQcwMDH6u6cud3om4E3FYKkxRiohIAf834d3Z/3akijH/afm0XbPngF+2N9NA8jQyyw+cqMhvAzHoBNjHLd5rs8jnHDwAn1e2PCcsrEBkHT5UiO+5Hf3djXr6a/6oxmUvkxuKPfdm97KCWR5C7LQojYTR/TZ9gLqGQov0lg47a4lneVziE1dfrYSHU8hiZXqZxdo3KlqGOeRbKPsOs/QVtWPDr95ChAiT4H0RSxaUwArrgmyMZlxVHo/vxP3CA6kvOk1r+G5xlx4ddaooUSWIG9tft/CLxUCcaQzN8vLQL2eTeF/0j94rmbRls0bOqb1pRq9Qq7ZX2ZM/b1yecB8uQowrXqewn2DJVsdbnX5ImEJVOamUqKnZXC/g6IvuIszPltCzfwGZYkl7ka7UW7oNoX8vTAGdacKF5JgH3LyqZ8Z2EJBXEqLRiyZyfzABEjPRozN0qw6gUFjlMgT/O/X2PsUhq4P2Q816ykiFlIT4TE67t7acaLYguSYM3x47BsKk0SVkED6Fa7NeaWn6oHlRWEjQwFHXAOdxp8aB7EYTRzuiHTeSMc4u0kbvrr/lgci+x4cSdUQaRz6zHej2kgjZeTFlK+fqq/L2X/1qdojRfs/R8IVCFtcd5OEOh/hjTSVcdB2ofUGErtNdxiPcTH/UtrmHky8RXzrHf1QgVZ/khNKB609TIs42VkmcPae2w3XXzOoE860DdmjFeYfxKaSv8jCWVuh4G7FUOmFF8JLZ2isOipKj7Etq5ZsJDuA2dvwQDOI8vUNBbA9rZtYCDAphrsUKTCFg6h4xg6o+cxag6cejFlJnVrt716EBTU5qaDvdD03kEVd1arxk1s/gDzVqvmhmj3RI/NAuPgKBGX2AAivioodGSJQZoBFDj4vm4pduu+QmXHIjsrU9msoDEy+1TkNGS5XJ6HyukYHtoYTIAy+71bPgtlx53HSlQDq1vjGyqHGzYxN+4AgzcszPvmesD20ZaiKw8i1c1gk3hFsc2T+W9SqlUdhi4kVgBawq3xSxG4rIvcG9eldBu2mg8PWYfDAwMqKOsYfRYIA/HjPwbEoZacwKVf8CHcIJgazKgj7d7TniEbjdp2BWWrtHtgDUk9a/jFMEzy+/Ml3JZ93vLb6ftjPfK+byddI+Y8+WvNbJJV/7ChF5GUyDI5FYlt9r2MRthEyoNaseGRb2n9xDqEAj5qL92V0I1n7ZT79cN4qnAsDDB2dmtyV15q88F2vFxLzyzYU7Dagctw5mvxTBjPbdeD6ngjQ5/3VhYxbDNj5FrCdG/84F8lcV8h1x+228GzWAB/E53+X/ge64BAzcHA1281+EhXdlwRhsAesS8WDhRviRkJkkngLgf1GUWxcSLDxo/6O27yzQ2NLEUCLsqswOH0p7vTf0LP7fkQjOY7kSlMjAUtDu6Khj5N1FstN+GMUuED4K2YbBT+wc+vqRb+OYWILm0w6GwU/J5u29p1Nju38sGheNlrJRmDRCv/V1V/2WZvKpq2k8v/bY9hDNS4Ek1Cx0BnMQNQyYJM6p66GuADLbTluIjz6SHBsYbMzIFv1mXZzJtRwK6J0YyCdkNtQkPHhb5QUNh0ZKr9S9Kd1bQac3rTFgdUpwDNQLYT6V+5C8X14m45motgjKnRmE9/ZCm84b1Sbf4C8jN9tbjTaD2D5z3odFvExuCXc0y1ifXuzDbdP143OEa4W3LGUZl3QxcH0CYDWdusxHjFU19DBKDO7xvYsyeWP7Kyq2K1xJxeKJgV5mdTaZ7z2sBEyADYMMf1T7hVzE7u5cA5PAA1blZ+RS4N2Un4id76x8DRJbttGYlKGPHMtLXxpZA97K668nebxssZtrY5PKXooUdrbq3zWQLnESYT4PiwYf8fI7OlJt4TcsB7J4KneD0lPM5juro8cie8PxDazLJBg0kQiQxe+cbxfZYbZOZP0cN6q1C+b+mid4vZmOGeXQCnY6LzBZoE8ZGeoKpGB9fS10Pptp/OAojdErIdx0o83GX8uaMU29ze5797+WJyHNsmMKukqlTPBCPc09BMEGhg0MRZO8WFefWzYKDxOkDELCZfPliFVgeSgqVSNzvvH3uRTmjzwfWI89RYNYeBFublUOy+VAvTuNIh6TAXKHz6wyJlp/n27ZNmYaPAkn+V++sZHy85F2pxigCueXM+Mn9ww4SDWVzxvi8fJyd8n8yVRCQSH+0dqSooEXmS2iQdoaZedPyYOOPb7EMzrbdzLc6Ic/8MpMYvRjzHdaoHhhArwBrA/OARaoP6S94LeZL6x/hZM1JsYLDBonHXGFid1JnRT6wz6dDZLe/dOKNrrduviHBKmDOwgm/B2moBK2h0NqOqri12hf46XylzwA5W43y4uvpyCGqdoF04NhDIu1k5jF7VFJNcYenk5jABjEXlq8gv5jTRM+YqnMYtFTbtPKw+bELKxHi0pI1+GNE+hgzzmKx1+5L8PRpv5Fzb/LEoNn4uacrb743mWyJfu4u4CPoH93+Bns4ZbDdRUun+MXrLqmhLCU9Nt+Bpe3nhmrvfV2FZ9rA1f4DhNxh8WCkHAQrGMHDRLCvbtij9dbACog2nqEEiwElaMjf6aQErkXnrbgVA4gzuOBECEaz+20OSq9fzOk3IIXWQmj5ucym7+UfWHM1zXaAuIeUcCeeTCJqnNu7oW2BVw9hXY0JWL+XBGOfF7Tnf/802AvSOb4WX2DJmBA9KZk1UEyruK/2EEVJn0TJHGLvz5c4F4Al4UgCBTljL1KbY2Y9pvDTy3Wjj6xB9I4K4w+w8+vVqiejpOFS7ltRvPnClivUQd99s7Ru0UA1cJBkiZ0nZqVOFpD79FnGMqL7dIw+jsV5J1IEGjxGLEsgO2jF4z9+lHof1JVoV09Xv5TrZ6SUnqzGGET2Wyz42fD2fNnwshlGnU5nus1UkaPRyCXn5U85fOMBXgBgtRx6IhONQXE8jAXpj7yytW2sZi3oQq5Vp6p4jFXMRrNCLDYNoi1bfpqFXIYpC5H3t+cxgsfc8oAckJ8nuFfMcXZx9kbeytWMVHs6NX4gbx/Pdp4KSOmTjCSrkijvAraczVxASNoM0MZskDaDQQ8g6u1fXEha2bA+9llvnuqEweeEqPkPnk4tMpk7O/nyO/1T2BTE4Bz9Ym/eJGeTd8H4wY+4F7U0KKH5cX/okn/AUA6j2M9uvlKyoiwWKvQseoiShYU+awk5vUCLTlYq80i9IvCnqiy3XjiEjcoX1Y800mFyu+JYMPUlNCF1KcIzkyr88yoJpZ5aK09UyCHII/nJNzl2qJ1ibip5i/XNHpHClC6cLvbkb0omKbwCTvLtgOhHKC4B0me2LAHdCrzfuz+jTHTFT95jIq4EKeLhDfo5CNxXuZDBWYq5mk3Y5+5/PFLHp0gpFTdzSXXNL6T4sLOz2NmCUlEAO24iG32K62Lz2nENxrpXsnLknbl1lca5YAbaQx9h8xgMwWNrlrlq8kQxXTvbClyE6aiN3da/x3Dix9erBCIs+/BG7xc2qCuK9pPncxBtD87ggtY89miAvB08P/jyldD2C5JvcptiLIHjl3M5Ln2pyXWzHSULnXWyfjj6Ruh2PSDuqUQ71LXT0AkT+eU6Z7+hcczro62LoMIk4LHxsL5zn4oOiLToBC8ZFGfPCo/l6fMVv91bcGvZ0L5TissrmSnFVD2EFRfOKbApg5dVbD7WPJjQ8UUTsnK/qPvNtLQ4HP6xLG3v7QsLqAi5lD8WjTVvlT4Tw3FYe+YoypflmW7n4M2CiF4yrvM+6gPYc3RzlWm9Tlk4dIgKp4FyjWBgB+H5MEtmr97d/wPWSd4MRsvhhkdcsA1mTpEgNelMrd23JQ90kad36A4Cfdehn1rBbMKlmByprEIMbsJG4ZjJ7/0o7BXsLuCPdAJKy5KeWAcJCLQbPpw3EOOLAMhm1nFpqxcpV9i75/ymaOEhQXxLBQStadQS4eq+BNusZbH6a05bXWkZ5jDVQXleyhSGTs896ioL38iwT1FGEpwQ3FCDCKImQXhro7LFYQzTdgrvCI8DNCSykLuhVBZ/aDHJMQSHSRcUk916Aee7ZsJnQrwFvowqDZ3i4rcMk09lzS6Y+j1lGGIzbqSB6b1k/yAGjeh6iSn7M/Cu54VFik2r0/kjktBDAWKa0+3WyvqS5kZ1WCBja3PZRr63Ig2+MpoYryyzUcrqFybIkdW8uS2Oe4I6BSlW6Aj7vREX7uGBy5IkHLg9EW5p5LffdqFVjMfGlsUzaP3vaDbv+2DQRse6zh0K5jjXq49hnZgM2LqSlLKEziuX0yYNP2USMBkyx06UK8oFu6O70GmSEn8z8VKupLbUdda9181/g5+SJysYoIKFdOFUkOF3RZQr7dPg3YmROycO17UIFaK2iOd3z+hIW4Mzw3vRbRAMtz8wdFfWqRwdo0UPbV25EGaB2vmBmgpHhhjyUWfGUzn//WN78l7P9iIITqn77TzuBZPKmRzutlpslZDseSXpeCMjdqTRPFUKjlkiYY3wA1fLKMeUqOt/7c46OiJ9zAumnJHJEAAx3KPlFuFGs5RZlrcLdHhvEA8za7i+bP+88p0hPil+gL9hnq2gu8DmIKY1F2A63GQlLi+q6B6l2IfNWNSoMoAWV04k6E0l8tgad5GYABHwOK64U/T3jZMuPWxKtp29jMUO34TqO16g5+GriEFWAa3uau1/D5KdJ0qvVKnQrMoEP/yjlI4nESLsZNsl1AhGC1OrTSrOVgXfxvVXrupcJ8yqzUKU6rDwLO91pdkBKC3AomvQ5Xskg38CUsqiaMkj+nqT/6TcCHdRUb8HP7q0w5q3lssnT8hEMy0OmhaclyEJJbGHZyab+w3p4wJ3+wj46EruY+On+i5y/o52Hue10QAblU0FeNJcvIRiSTtPWs1hu3lhEsl6TglA60i0QJ5ZcLFD06Tfq4GrEsX1DN9ikcrdcd6G97pvpzfUgyMyPJ7JLXRJw15rylDZqhjpFG6BlvMM8C9UpZ/0xJq7Zdbz9Dh2BRifhWMx7tZHh16rPToHkqNXFUB1Zu8Qy3sgLqCouhcEhi0MHh/0oRsg+bAMVGU6ep/UPZBwX9NlZoE7d+t/2ljeFDhj0wTGAvo15FUxwewyuo2zaNtfk3eFNQzso6sms6Wuot458KiQ7gb7AmO8ZBURvaSdJPI9f4f+2kaf1NSriZanBIAijC0lxxhaW/A7aznkTcOvVFH7s8w8IJ3exOx/sdnlPO2uE815zAGq1DVC5Rlccsdr/y7p7y3z1MARx6aBGZYq0SlpwFO+Ogd6TS17E0YLbqRzO/M68mFyfh43y9/Qn275R0ex8wyWCoyM9qD1AtdliTkMuDN2D+wpajhRBA0bqWFKd2FJazsqb+Fj+72zicmeSSrmIMWQ8NVvUuyMRWNJlUDDUkcDVuiq4QCZTKC2L1RxP2Fa8JrVXXFPQbf/F8py0MCO9v5RK+UhlXb7Rhf1u2aQxlTjm4SzShRQkFSynV+4m/ipzqKmkrXL5oQEHvH/MEMl52znhE30RpgQmYn6FTjZqFDLuQRmKBHefIskN7zc9HwWG53RAEpyATlCDAOIwKQQNcuaw+zWv17d47GcT7ifuipp0V16OIYnhqicEJZVW6RnJYFHEfsKIQh75PYM0UTatZRbHK3vysxBwkPczcZsuSnftviRiJYWtQhgswRwjfD7nNgl361bwSin6PeMBf435OnWbnXVQpuKSm5zqL52G1WD4m+6juU3zwq9KjqYR+kjphhxRpfNkri926f3hTPnVVobyNmcYCivBvl2Ls/bWYXqXNfu1X2giGwpc6Jhcw9jSsmNy1hRCZDOlsEnvzw4Pvh4ARaXNVKwo3mYa7FjHK6+rEklcgYFMnqG6XjUhPm4xCy5kGzK5Sz2SZDNs0eAANvFK94INmnaItIgE56mWD7a3fK2PiTUuOAHgTuoaMqCIa3EZkGCEB6M0Y+ocrvZ3yALypjvhXOyPOh4d3ekGozV3uP4XXRiHZEERe9aGHcf0azAb3de6YjbnvIZgmUVRHeCT0kTi4DYbCj4U3Rh+/oVpXGKnFATSWkWAcQiJiAk7kJG1DoV/epy2XCHIy2HQnmWunrRzqfdv7bNE4up12J2uMY/n9HxlCVHyC6L3iNpm/MvHRGUqfyk2WwcH8brEHdQjETnP4thO3KgtFnandg1PX9beoIHYkGJ1bXiHhM/o+3pXsm0IVUVXUUZ/9OT0dCcPQnbSyGEeOzwsKwmaKw7ERpGnyZbTlPijQFQVsGbvEPo0pfaweaaeM+BmknD031csaA5ZIoiKmGpoVZyka+npXxr0Vyq3HYoCSY25oAWFV8dW1vNbEPgovPWLjuwqAs3TESSDNnGT+rnGfOMG/zk2r6oDnq/Pg9NvOmqUXs2Cif/zt+XmhG5BcUxVpymhs7KO4ooEkeOYuyl4ZpYPo2WywvP3BWTi7qRlbufzQAbz7FVLLF4kEiyjGw/5FYweA70xivmWi57WCwD97k6YFkN64o/EZlUAZKeDn4gWJcet/iOTX01mFTZgp7akSFGJDr/sryB24xZJdOkRCXpnrTgFjpcQrbBSzkZBG+mBnPmytjDXhRouu0SMCj1QSSTaEvcoT2QzSJ1AgrQ70GrdwaM88tlO2s7hIyNAKHQOGZnB8KhEe+5+mvU8SrQ2YZEJQdRU3PNIuqVrjpiyyFBR9nv3RxiFikllz7Hih1IiBAm0K7u0ExaB2Z5uEwopaF4iENsxkPvr2jxGAS+FsGHmvDSCKxgOtTZ+p2074RXUfYUJlwMFdItMcrgAPIctiqndlvIUCBgRitYfRJ9dv6IZUi9punX4kB1ySZYkl00NHbgdYXW2yM7WeZh08ht7DMpLb0SgXrpzXJRMqmLgBuGizCUS+/mO+eQc3oJa2sGYglMDhP3CFRW7cx0LBhZGVvPbz8X6PsUWsHAHr5cdSRaxYraL9Tm8XxCogr/UIw2HOOqRQRkLzDmlhPg6WRiPejX4h9FjTBYRYLtQigchRj1YN2AXTPu6zgS/T0I+qqmq6BdbL82SClyfU88sUADjfO3yx8fknJuFYl9nN4ApTIr9O/MlHItFjICR7f72UF3XHSriozsrg31MEzHB4cIGvBJSLh0gna4q+PXgNAFFM3oYy/SMbfkqmYBcnxhiubR7t/0oE7PC9W6GR76FCxlf77kAE7T0I+86KCaHT6YdU+ks6OBH5vd9rXoVmg7xw3iseDzdR66yczNtPvyAviWFxdtHZqtJfe0Cr+MEwrmfyAeROXd6oE+0ethEJLxykXrU1o64yW1DvdWmlPjrvByPKi9u5eEPEZW4kP948PlzrCt3oNCYtBLxAzNbbYlOSnswXQwDHyfuIm91LjfbdarpvoKCx+LEX4/gfn6B/pR/lME0DwE20StFpS8qSkPUlnkWtUfi0FLwOTe69VNOG+9Je3GlRrDp1PxQ92niN9V1xMv2oPd2Hjab19/Y+W2ssjVQaBxkjrfgQ1IjItznL6SC0ukGtFuWVga9s9whh8kQAOBtSnWNZ+am56ZnmEFzZXE/8+jIpa+xkL6u2h+5VpVw3ASihFT7iEGe30IAo01RU6Af00VZGUJc2qtGKW4Va1g4cTYnOoKybzhN6EBWB88OMTQPAdENwc0SZNxbwfEMIE4BrUAX2XsfEbDV9onaX4qkUdHDT6FXrGWJNj1RSX+KDlVYRB3fga3eSDl68xsq0eGGtn35a3Clls3mEB1xbgakMOLp2C/fSyhj5Oy8T79tQLTkCP3nQWa0XeR0ikdZ8gWJ9TH1g5ELJZTWjDP+po9gMei4Kx0SvB4SIkYjBejRQIky0FzzTBn7zUEos/hCLaqlorXpklbRx7Uamez1H0aT21OlQ6zLAk8x6MrEQ6QYILlJsFXtpKCCa9WVTJzDy4+pWQM4gwdhGMMGauUTiCzWglTcovSB5dDBfMv/546pYnss9LAi93Ip0J3p7SfWNPlMQl3sVkbVte/mQt4F61MAuUUnfXEQZnD/zbPNAlc7mV7nAez3JHFapqId5ZIi2qT18QZ+LadfFzL46Z4+1TMWaXvS/EYIryLLTUbHbhU3mYcBWT1yZmXNrGAz0hDmIdeRu0Vdar3UCSOvN35OrQQXbSPSaN3Gi1itU1Z1sL+wuSDoZp0RhE2UOrV1b72Z76NdMIar6bCn/GINWAAAXstC1qA82xQKYHnOVRFYQGxda0ew2aePL285lPDbapaSPCmcid7iIzai9EAE0/e0PtgjWnez4N+D5Euox6mRLe7QNVOi3U4Op2DbIQzGLOlKE9zGJ+dcR8fbg788prL/HXyCSqoLTH3zBMDU+upPZ6GLGlVfjfgWTM/8hLjktExziu4DPStXm47Tn0pAk35csvtaJteRj5sS8rr/8cdFN6tZgI+sqwzRWryyF2RZo+lD5I/wUrBnEoKo/aLwueIqeU6iGBnCRrZhDAbUnXbT6tXIGACXU5MS30mTmy3M3mneg8JeUG/YvsOUpD3y5CWCRQJ53fFCF+wXv0o4r/W8ZxhFVQuHWoGYEAvEwlxo93xtStsbfPgJW3QzZKvhwX4SC97x0zjgpycHOwUvWD0MqQI7TkKgUjguPb3F5Bkte/ak8sxgENpjuoNdsc6wqJFnQ4RMfj8U/2PJgq9T+99VGl2MxbE7rd8hBpVxptgHXSh55/0RZwyuEV29x1qE6gXVecwfydUPC7lBglwbzCujuO44eMlNdUXjH+vQ+rE/DHyBVC6+466NLqtbwrGfCjSot9nBA556PtRR+jBXwkUgJ396iQiXDTOfneK2fVsRgVDKFMGsZZiKSUpf0en7YIJm/ani1uP0/RdUyvC2YEdIbMSvPsf1esZqftFaUEp5/aGS0TSD11uX6xnnBkNnZkN1QK+vYAfNgK2rf4GT4ULiPbGFEJFSQU5RGi9d1Ugj+rsDch8QA38fcJ4iBIL3VujCjg4ZMfcT1v2mrEBmP2iEm0Tdwem8/3EWBNBQWh7E255u1Ep33P3vDdocgQVyYR+Ym91AB8nhtIJS+jRhDezeuxDHn5wsObO/2s7P49cwBN/6NIGqEqCJxOaKjZA4TawKj2rPHl4YqG7ssl7ASe9cvSz/SuoKWWAr30KBNPHE4E9mGWp5PL32ShNSrGp3MQFE/CSE/JuhCqvy5rEI1T7Ld2uDcEJ1qUYOuXTws5W5QpJ60+/OqvT5gq6puefFG9XDWuYA07c0QTLQFLw4njkrIdG1K8jXZrMSxbTogTBj41qOYCwuEn0XprEnKWN2/l7NLGVQdAfApsNgAgnSL+4QbSj+IRIleTyZWcjY623/hudqzTL+Gad+tAiA/OLKZu3apqvs5M582DquyojGt4OTcZUQhhC9HE4I8qVMZk2zCgViJknlfpTUyCfswyu0Fcb41kxK1iViwaEZvdQ7lpC5yh6jmt3uCmtWbvahU2gAq5ByEga8nKUMGyujq22T/KRzxr82JC0LA5Xz9okdLtRliD3jtVCEimELEckyDwAi2qUfE/bm4umQdXcN+bM8UZz0zKbhMvq/djJxwlrg0Rqhgkp7Tzs6pq3rUd+KlxrUwKaV6VFyh9L+7XSklV7wfuVvcqOrMKcYKLpE52IDfeAeFVRtoy6t7E135irllfwUMptXCwE/bH1C8P1fT2krCbkB15kZAbggmgDHU68FGuJjqQaJGPeGzkkcXRNsk8nERAdo9aOXdTQdZ9PpGkE1wsXAHacWttvOVYNALR8211XCGdFDUpZ9Kuy6cJzrGhptzzNUuRsqDvUCX4kxTtx8NTI24M+e9xv97okNR2j8CI1IGVCwS4sh+fvk8fOPe7WnEtSZQsXeHg07rYBoMQ4B/+bc6gTS84/T/ixYNZk+D2HqfzBdx//MbIRhbz1i3Sp0x80EF/GETBnG99MOT7zj0aTJllW+miYq6HScXDoYDev4jR0L4pgzBPShknC3s7vbx8AojBKTMZw3ARFPnAU9qBAymYjtPAECF+1uCMURcxfiIouSzfLzoHX+WdTHmRJSpqbea0agLzhUQ6dcFZ+A8NBD9HaA8rk8lJKJvDyGFVlSvSrKROxsHS9sVTstY7GY5jlNdsYinNUSATOMC81E9fKzHKOxANjScFx1frnkPqlr0UKEdFgd5O7aegEYADSsRhei/fujq4uip9NLeuyDtTwXohVoAL/ptWhJLLBSNL78anlVDG9jJQdH0+2RmFSjhaNTAdcCHQXDptp4FjpWEEBml4aoaIZv7KfFfjDzpLP8WrO5SK8aUWh7FPM9Zg22nsatcaJDBqEh8l0BIz9dqidl6T0Xin/jhlJ/vur9emTyl7+qcJs0zT5nXA7YWedl2ZzgP+Bw+JYoSadewjiyOOSvxa5RMF+W19xVA09y6Qf1YctCy675qO5bpDB1IZcBLi2TKrCX0Oh68SMEoFOpQFd19lqowEp7A7G2Fp2Oqv7l1YMYf4LxJA7R4D3cXex7ZJME36rXMTkcbtoseHFynQ/hs5yHi/pIa4IhTKnMGx5JIsiEE2PINVdvXPE9RmcGmmKFZxj7hIt5vCggLGJO6zkGWClgBvW8ZY9N/N2fwDGOes6pjjU+bZT079aYq/WFiQu5/tKHqXuGGsssCfCzw+FxmX1TBwkCpZfuvPF7jCz0gd4LBZpGGKHPeMYU1RE63NXj7Zsz99OXV+SN/tqOaiMDNTKnrTtgBgHy9rH3ZgvPeXsrU85zbpdArLGdW25OEuEiiEJVF8xwkICZPFXvMRInh2RjEaQZLMWnkVFOZRSTLXOJFeZqikMSEB7CB284c5v64eZN76K70UcNqfN0FQD5AYhZDDGjakR1ZP9XOnUlUNUZVayqIjIwWZEnoX07KRwmw1MV4ffFR014hcWw5kxPT4IxgoldbZe1jG2J3WFYRQDjdPhMKxoNZtYFQEdQ7jgDp2z0iqH70pBHdoQSm8k4Qp/YtNVZmnSYWd9sRLiuq3gdN3GR5C3US9kNxVcDYh8CApcI5Tmw+XLzR39G5JghAau/JF02kaP+c+EcP7prQQIyZ7yTNgDSmothmrqK7qJxnkkNKFGOLDGr8Kt0aK3PdDWm8HjsdHdp/dd8rNBS66vHFG/y4PCyltRgUlmRHH75PukbKLg3ywbpQnKZouv4Bxlq5jZ1QH+LDORND70ORAc2dP2GCkCBni7rojruD8+5VGf784c0mfZe/hsLc+aFkxhF9A+pcrG5GwJJBJElU0zG09afv/B2jTdUDi8fKmjC/ikuuac/EyQmgh8+KyPKrEzcjZEQyFhAI4nEdda86LJsVxxlnFNCe4rpLsoe7zfuAtHbFzBF+OG/N+d5s/kjEnjj0XnB+i8a0lxFQT3oyY6PthToHlJ/ZYrkI0GhMccZ3g7p3M+3lgXC65M4taMOK16ScpLZdxsIN17lcCK1EIL72mVDu5E0zqMj8SjuVvAJMDqUAEdIZg7KaMnPF0BYTCg2wncRZgxAHagbbpwCXlr4qsC+YRxbk1ukRA7ScF97DdC5clbLE/P3XKT1yp4IDt0N7kZUK94mbYnL7AuOI0efRlVR1p+ZxnGvENQ7YzULwxEPgoKg7coCmsdaKZZ9a/g7+I/s6y0/VdMkl1sPmKH1Bksu6u1Ilmjk3A8wBvxN2ytUyAQkO54iF6v9G5zhyciTN+sW//rpN3iaIrxyOzBynoSW5yS6SZlvtv4wieIL2stADm0FMVNSiu6Invu6nlIZrMcny0EyWwTE9/nUziW9uefeKfP9w2aw2qUCIttwUIkfAkLDQDeqtYCSQiJJo7881CS8wkgeWed0XM1DzOU4racgTWGAOqBB7byvwjoDTiRQAMzzY9sVMPysAdPNvVoH1X48PB1qjxDCmtqa7SiY4ssJjbMenc+6A9I3k2Hw+pel10/XiELWsTAZdK5OIQpr133D0mwSHLROsWhj7eBvY6+Rw8N5cb9Q9H/OF0Jbtte8U9T7ywBWABhoYpPZn8v/TjDZEwdBCRIF2kKqXLt60cQuivX8WrxCsMeaGyrlwyybuW+4C3ebhKIAE1prkq/0BvyqHDadO9Fe3luZ4t9s/0hlA5S0JZWVEk6Br1oqWAsEwGb6c03hbbbsneEP14AaISGrlNTq2+GOBCggHnUul8we4ko7VM6ZamIQFLc5CtwERchnfGoOX7ibGmuncGpFJcA2pg2EkALmIU5RdHfoJaRwZhddoXE/xacHi2l70Y4DT0IAJ3/Yba1AuxPug9LEQ0gJ08FrR4UYI3cBQwmhpSL6oQiZ1e0StrkoD7rTLzApIzY4ngq0gvJUZcGA6FJG0zNwzBmL29jdZPTkDAJ36569LEBABrpwCHEpyg/pUTgOE+60FyOJFpGELUlY6BGd1eWwWF9cswCLo4Zi6RqrnYXlRfUfdMT/LRk6aI9+VWC6ba73x2t+wpWoAAZqz1rEg+Gv3BbveP9xesHOcbvUmMiWsMLEQYNjzE1FWFD6BlrBUwIfPR77SK3qgUGsPlsjObaNSg05SrJnSqJYw+jaAGI9RxehwYk5xIGsl+qtLq6JUgG8s8Bc41fIW3jlDkhPVZM6sNgddzY0gBOIXGPneImMJ/qJl0E/NN5gPVpBDx225/wtMq99ru1Wv8tzPhIbevFXBItJKA0LtUI9vZT3S53NFVKEvs8FmlFxJuydsO8xE4/Vc7KGYoVeRh6k5BhS1MD9T7rk+5w8T+c7SHaWIuw7Cl83qSG+b6+4eS4qdXMIcrnJxuwZVquqhxqy80VjgfxokGmFPHJTKEmft4FlZQqOe9+Ai5wxsaqHpjzXsU54GCZgvsYa4SIg8EUTrnSY3acUY/SvjeO0LHNJSyuPuwqkYP1TUItA08dXCXuSwENWDuhibys1y6xxJTeleZUpz2KiB1AkvMj7YRZ/wDoBecuRSSoSLVCD8Fp9236YQjPlE9GNm+l+RmNT0i9cUs/0ufIX/IwzG7TcM/ZeUiL/863SAtxqjohPKkpC7wMw3sdHN2Laoig00KOcFM8ruW0/5+cXHwoT5NtDGvgOBWQHM6FkKCMA1aArA9o59iF9qPKna1t4jklHVwMHRxRq8CmbJd0Es+rXGgRYBrbpnU2adp3lDPKBluJan82YUn5tx0I/WJ+oe+ExNpjDbgP4OhAbAH8HbOo3Fs+ul4TYGtnR24oJ4XB1PNctHVJ73phSiEVnFeAcK+obOmc7WGOoGFzcSnDj4YR596xeUVoOa+roo1REJpdtJToyNXoO5xbtIlp23G7NEEzjN9UgQcJCV+ZJsIFi68tchxSkh7UQn0S25ssj6hcpLRzjBjGsb2Q1s32Z5Yfnr0ruWLdefuLz76XXGkp1nlPKG/9WBnY77LtS+kbRgCDr58ePrhHZQdjv1fF94acO4shrZilLFMI14JFU268an14cdEtlnW5oIK6/6zU0go0hXrUX3lOxrT4fajpWJpGHLR13E2qiRXjIrMWiivP236A5YWGj7asCZMhIrVMDsJDqsTu5/TEGAJdcFF6Dcl592AE8SurnucqbIVjJwIMcmUfV0gkWwcKem/+eNQNZEXvCktlKJ/hTSXmzgjig7uynzZYfj98POqT/LzawJU19o2zOgo13mBRBETMsry5pSjxv85na2GikEJDQET1BCI0QWW/r/8eeJofgc2UHerfOKRJNdT0a1T3wtGcDBct3kWy12q6CHpPBGCSb1nlKeHjpVRA4IwC4MDT3IfyERUCPT1H22BDl7rJ/OAe4/0Vf5+xxy9WX214c7x8Pfa3uEtJjMRew0qliQ3AQqMTjpJuKgD42cUt9FbJs6N/rgJpezIpwVERMN1m9e7Ix7f4dsD26Mzb92XC8FFPZCJCNt9zduhfhDZcDVFtmDALrn2UoD0562Xwvh+q+ya1B0ITWa3AVeXqxQb7vXIpAidB5zlBNqprr5GekOGgHKcsNn2CyqnqH2wRHsh70cK9Yf8bLdE9jzSYdtQzW9GEREqMfKeh33hkWepPrd59eiafRhqotQXBSEw0XPp6rqFu+fLFZvcjz7Gj6/el7ax38s9xyBgi/EoYC4nnYEbw+57DWbJvUFzP/i7GyBx9z9SbfveIQi3Es19ko5vYn8H3QioP9rR22B8jZ97DwRh3tOz7EI0v9YNE4ynwxmHJLOmw6dO9AHu69QbwCVJOgpGo4cVtZStseeXae2cmYUnJZZKrTfvUhkNYMF1UU4SAWSWehbQVZGibXVovK4s4FWmcM9p5isQ49LkPcWsf/WKFdtznBIKXr6HWUQReR47RCn9mv6Xxte/jrRJIAZpNHuTl2LoAnlcK/hBkc1qtRJNaJyyodEdOkgBuIC4Cyv6GIx11wbR9+44DksdaT/BmC9qBSjP2dN3clgm1Ql35O6MkNKCJ83HtvHox8WSRkEUwInStB7hpfw/SLaighqs/0oa9cFeg2Z8+hHDISP7eZKtFumEPs2WYff5qmrmbB7r4Wh+r7VNeP5r34KwSIRDfFX7XB5du78drdquNiAC4oCA9QnTgq9hmb3VyixISs915zyBhfutBjQ7QKTzLrSEHGZMZ5AeRxSFroAL4uDhiCjlOsFxcUHHuzTS/CzTHOqvaop64Lc1t5BXuOpIL1pQgYDuRdOT9P3QA6qfCEkmfCKdUmhLX3Ww8s54vgLGhjnlEGn3pZptJmH2oao2JlPIkgy2VHsylrjqhHwFAkWvATCpQpB6ZcbQRTb8Mur7/jG89Ja0/0deQd/CzKcWihU7gG6NuxsCq6T4Xnt6usG+7I/Gc8Y8wukMUm69E3OAnsJnzI+hC4eh7XpM5jgh45b9HDP/YDofh8DQRpsuqa/cJXxgPXY7yYA8S05pOAhMYnVLSEW3B0vn2m9yLbYRm/ekEMl4oqyDW6MXSjBnBr340J2ffBdiYBLUqM0N7i9NMY1iZD6IBO4eCHZO6m8nI31u5g4lNIoAn5NMCpE4irbDDgYVTWkZGZm3UUVX8gNkaK22+PADEQrxkC+XULuMgjnPZ7Gt3UkDZK1eLUrg9dCsEqBk3NmGo2WZHLsxjObwncQ/0pM1Ta6s411LPoaMg9q+XlL1x+/xaNIV0XZ9mGT/Tb/4235Sc+JYzQoVl4MAXukuiL8Xx7svMIrG++XDJSGsnVFZ3VlFQzzNq7mWDFljOIe31Znm9Gj//MT5Nj/iiytI+a1bm8tBODvPQQYMB1ipSzD1qos0P+CYXPOEI3TE0c8pImW5iTA1sx68OzBVjE775brJLl0iBWJTndZG+HCycnNYzJ33fOOVBpbKZiMJYjUHOvW2GU5pPyuPQsGDG5pKbBlwEsAo15Hk5HfRGbPcIO1xBLZi+rOaS3iTyatkOmohjvpDGsgZGWsFOlr8Vinpfc2EV6Ca87tov15bT0nYVlet0LTNzHq6wOF2a+LxgqfYWUXSCl/1codSbfjeb2cjngSTIyToGtKF1tqbCy8nk+6wUKD2o7zN05wCeFRqg7smC+Q667/6V5ZVdl9Y3kJtvnqD/daX1AgD1rvqSdvHLki5iLPwVrPLK7GuLl8JftwzxiYC5cdlN7kdhPPWkd2IfOTDkriQoBp1avazVloDhykvAkiIJQjV0/hmBmI/zP3WO7vdYmqv3IZfCXCj/jPDZ02B+c4nOSBuF8AU9qZVipD/5dg537lbugLmjgyJ/mfcVi8lTb/tPWtzNLPjkBLisaYaWoix3TbbuSe2nw2esFknITf4oOegL6O2lCCk6MRRJSpHnNJ5CpbFdvlzQuKiE0nK0iFbl+1stKlx4iLmdEQlUGahBxOt06HfHgVvXdEmOaVfNIFyy3IyKEZ7LrXuU/K9EY0/8Z2I/YW9BR7OZoiKAZfKYh1ierhepBU2U26l5uYFYtD8vWlk4rRtKIvWwsYoQ7MYs34SalRlmriZrBLHwqMuF/iu+6ljDzg80DPh4aAL7NFf3Uz28vxkykiryBfk9Eh1dBhXgQViXHMOm/bVi794fXxdpguAPYPOzqppPkERdkybkNjyqjcN29YQYLOFNU9eoYpsAVzhe8opdMogOAaHX1FUK1T/1GDapXJkJTbU5RHgmoR5y9/5e9NKtnrAru88Im7+5uq0IWazpMDFwttrAPFYweUTBMqXh9+IxHKeq4YMWmwrh1BN2QzLF4cfuG3rXAedkGGPK7MSyD3lSXGNrew1tDXUM7pFg1/RQsUqvRsMAqFUIXRaAhKcBfu9WA9wz3csSV9iwJ280LTxpTnCnvWIPIy+MMWnPuF75Kukf+/CHFc/K8QW8Pi7ORTkfapvSgaBdQevAodi+KDZ/K2O3q0WuZKLMrHjynmawuF4KA0UwLbp4wTO8RBeoMPh5KwdRcKrnvxzQNfo3MpHCEQtWhT4XgCmTezRqkGAQH/mkGqgt6wMi2+Np5/PmOyKnAtRfljiOV2PsF/OIJBKIvROsP/ONloUm//8Mn14bq8sHw8+jPthWWTMa6QWrVwW4zZDalk54AMRfx3Z6lJX9dxfuQno7mt86ifVE5N5D5z2FSlzaZwzUNdTJyKKidHKOZdAArSSV3kMA2IvLHTMcMEmyKvJpOyUGGvQt+72LjMHeVA4asfLpAoFuWqt2VFfuIU3EhhWmBSuupd859sWvmHNFJc/5SebDoPWfLoVHTGepYBr2sm8CL1b3AMyln4x9Qzf8Ci4aAHKgWCJTVKu3vsOnIm34Es5udpR+Gw0oeC3k7TN6W8ZulGGCMenZa1olS4SP59fQkarLOUAYp/Jq5v5S05x0He5PraujecvNlpn+lWbprIZTx8wqEgE2r/XM6RrI1GfrjbAmhHbKRf6ez8eF0OJbnM16ijxhZN2qdFLYlBdZO1H3qH6XvNZKm5dOEo8jDeIO3Q79VIBE1S2hlrFYO+OZ1NFOla6Ab70hkyAPDzhHnMzyeqj37+hU8s0w+M1pQKTUCB8T75h/MEjytXDvBICCq1bOA39Pfast0ZVFvRGDlcvbObWfA5Zpir9BsuJ8YWN6VDOXlsuFnJyrNrZh4yhelva7razkGgrAzoQ5L8iOWpIHp7XFBZ04+rb5R1Z3jOi+1GpO6NlYBMs2L+6I60hxpecvmEcIjR4VnYQ+cPCRlvIpGEFJpPNNp6jngKBrJuQ8Av2K/C0ULgydXsa1FIa8jcTpGxE50h9l8lCPMR30KUF3XqDn92Z4z/1IWCyj0T9Fjb1or5SvOliIczC2rcmatchezVdnhmF+pYOm5KeSEBLU9akwywamzg9fAzXpFGYZlIFxkfSh7IUwHn1914NMUQ+qpBQ2WDxV89/AiZXC7qBCPvusGqSqYpIQd9219GvwnvH0e4ojoQW7ntt//iWeo0GPYmpdMbT1HwWg8v2W4livxH6dDrXjz3dJXwDBRaV8QYTIZDovUflNuppWzTKoevo0yMLqo/oBVqrvt89AraJqw39Gr5uVylPbIcknZC/cCsivoAAksz3DoUwA9LGttJBUWfB0VHhRQSnnYH+6Scja8mcIWwncbAKMohfWPS5DF5JxF6Kv1YndJfioTK49wLh1rIoqY43gxKDFaUYT3+ueMB8QInDg9kNwRpFHljjrrHbUV9nJ3Uu+215HxFon/MFWjrQs/TMsnoK0PHr6+YYov3mkSk5Y0DWr/mxMvu7ZQV92Y4RcTXa16/dNvmyNTQiy7WEHFHPrlI8heJR3wlo37n8RCt30CFBsyS+FSq7NI57D878LJIKV5ff2Ikl2+r/d0MWqJy0GrE8+X2MVBIHwasoubiEYsqhaMdluqMNSix3lILBgpeRnhKveNwabHcBr/ER2vUowMZPoTM7E+AOEQG/AsjgYvjigS22NITpdMwEiu40EXevynKipwHr+ttpqkFf4dZZdfVmvwdE3/TwwAVxTPGIQJzuvz3C3yDhZyKUnTBaiwjd8k3NbIq3cw6BmrLsHVjEQ1nEN7E5bW4V9gnLO4diI8GRi/TqIv2tUnF3s/BfC34IxPwe+9DWeq4HIq457pvtTj7cVz/EFLkZTvbMkOhYbgE1DRlo58Ng8zDH7x5Zd8d3TcJ0uBaXuGi08cdWGRSH+omR5ZxbM7Tjl4Yjq8wfA7JgH1w6BIrxZLj8deUAASPQNauhDm7O9O+vzgpR1GUEwAAIai3K56bIq1fOtvudl/zCv1CY9xNqbI4MH1WdczmC/8BFBe26Qs9WEQn0Fz24VwVoezyccNCYzvmAGc9utthV0GgyhM9eRoCRBDzv2RKYSVmYE+FupRyw0CNlGsbsIE/ndPof5yOlDqrrHEoEUuIvaaJKGvCbnlvYXtFkkLE+CgX5VXriX5m2I3yfjI+lwgYe2qlmfzCyrb5TwYYVmUE87m7v59XEy316/cYx6noAd6iBcwQ31EzkSOEpUinK1C1JFhZtJ6KT4rv9dDuS9QXJqvzp1J/RpUKVkgQYiWe/rAvxDh7M0CFyYD2JnU4sqfHTgz5zQmiX03aUgor6W8RhwXmFG1T1qo2tuzHfS4xS8E/CSnCqSAfUJAabo0SqFS8OuYDHRAzYSOOR2OaGu7GrpH5Tohx5XedyVzGrvBc9qz1Lxv5kfJUe5fjzWvkTlPEq6kV/PfEBLzt38vwhtWqS+EGiSnRce0YmS4xX0vhi4lsQSMOIGFnA/N/D0lN0x6+hA6JcZ9k2lq99Q5XkDagsJRE/jh7sVHA4KaEA9lQWKRrFB5iD2ZVwrnnOS2/IUfsRgkmW4iVGoa1NdUIXi5neRRcgmKtP7JLu1xwVvFXPN9W7cqc/r3DR6hL34iKpcnv9DCOSjG/qG3wtYyhvHeLCm0WHn3QzqvsG0Dj1kbYdz+fois1203OeXlhYXAQvimb63DduOgr1XPk5/UWnvq4Z5ANtze+u6XH1wTUA279uftszsJ73/vCGOObqXxGcQvif5+FEb0DeSueiHN3UI3p00ONen1Egz6Ono0uxK8dpqjbwkRarQpSWl8Wkxun2EkZVvMQwEsEYmiNew1Rxy4FvnOLGjyyHPexnZ0rPRexbKbHXvdO05fbGLuduU8OBxNHvgteOhk93jD7+3Etfvs7YRMFP+U3jw5nMxslLycjnvSeI+G31S/AwTvPu0AcFHSS3kxo8wZbnsXn7RRlvQiG5AV0mLHvgsxnZkci7Rw+LAO6KMeLlQ+XuwujIgehfGZBX51cooTteNkuG1IjAzpqaK2WOSqHpZ9SxFA/7mxrNgrMBlAynpj/inQ2uH/aizyRaQr5Kf+ZPCLoP4tuj6UetyJj01b/Md6tuQFGGeyMQWbY3HLcjLK99+kXuHKTB4oPQ+Yzca/i89MAvTy3gTxQk1r+YrKFHUmOVqeWehGc4MkwIyxMKh906jDJdsYOT356pFP1yhnkbQFjKQZe9L83c4P7QeuykAFvB9+Uwt/Gm8sv0+VV3V6WyNPw1VlqISX75UlvFnjGr60xSdnqvKb/G3uJxXf3BoXuZm0/zfzADXbB6rcXGOD7aqBtVGtN7QjO4ZWBZZ/IPJQh02VI+TeYNwIJHtLTkWHTy62dt933tlV/6CuEoKPg3V6uzQIzjCAyfa/Q1hNc3MFQPs73mettZg3T20gwfgha7NrbxqxYH5FbqQ17iGnQ1XEoFW+WHYuCdbMPvY0GXgDj+e7rCEbnIaTBzNg1UaZ3TRgJnDZsuFthUb4bgWJiMA+dTN9PzdVLEpkCEMvfJQ3q0293Y4K2v/6/4q1P0pCM+jN+O0ImehgEoBG5CDRWKb192j5441WQs+/oX8hsML/1euMSiaImLy0Fn5vmdn06hcH3U3KwS5scmMWzy5k7XPrWiedZU9aJiziQsBQkUNlcj0vRI4P9OWgbN7EodCN98eOTWuvsBCexvIBtZkenX62wVLhCGzvC7q3DnGgFx9BE3yWeoAks6C8V6z2w05cTDQ3ima+WZJZNPjUK396ERJBcrVitvr43ocK2Fy5XohM1OL14H+o0akIxzEICD921JzcmLu1/fryIEV0JaT0m1MaLvaZ1I/9VaT2D3jHQ9BxFhJAIZgQGWuUC/45Wzw1T1MqlSBYqfwRKoj+tHtSm7ECzxGmwJS7l5inuyC2pgAUgXx9Gmr/7EoTtNqlo4s9a5cp9cGSXi3ctwVBP7TKDTF1wRtc4HC9UPr5tvB4Ne4UBR+llh32km2qeIKX3LaErWCZXjgQxxYxKcJTgzyJ+U3ndhxEK8JdSz3BFDT99Umaey26EyJ0ez3/CiMmXbsKGUjjXhNayDEo0B1k806sfrN/H/PDOtdtcM7WSY8JqQ0VcgM1/6fjCPlzTncatKDHPC2F3FVSKTNfDxHWQWHs44vHUOQPIyZBw0oCTFSiX3P1cngd3rDSaFuliz2iRQnOaZZFmkHfYxIoOmSpjJbvlYo+TD03LXpfPQXA1WgJtkrQgxqHlit+L92rbbujAfkyaVG/5bjizkuC272knHepzGknXZVpQa8ifolCu68utnB+6El5osYneGPIlBuAv1Vr7INYY+LAAGf30mFWplAzqzGxOQgBWwrdUXSci/aLvmwmz2UjWNja4+jepn2/s2iywFDzMPsNFWqZdkq7aHar0Q0Z/DYEN8IveF+n3zk7igV+mvvbhaKoTh6W88VIgFHo0GHn4EdzJH55j1IBOJ//DJou8+y6nfRciYQSjv9QJOsjPnMH7JZ75a6AloYyLy3lq4+JJ9AJNMEZXRJhCeb0xjxIZ3FbqUsCw2iazzN7e+l6/qTQd7ytR5fEGs5etJEsd8fIt0LLs0rwaTb7dc2wFECj2FHF3SiGV3PE1M3bwAjTq1gyCIyb7OSWPLAzD/zkiZuwbiYAqbYzTScdNrhmmlU7U15fRub0jE5BS1/fYKkdVKvriFuxnqhwBWW4fEhsxqcx0aPtrGB9R74EzkMNSqOTRysGcBSf2JY9ba1yCkh2/BRpRNbZPx5gzEbNxgC0mEGDqtHO+sk0+yn+qvePgZQJTWgHVqYajowC6j60OiAZmsH6XB17Qvk7Nrq0qXpkNb92u9bkL8QyqvDXvz6cgKJXNl6QnAt7iNX4Avap0epQAkrf4YBzfmCxYOFgBgcFjYACyYJAraApwDAQxiHKB1SISRugQY6bEhiNaxhWowyPZiEs+ew155YFbFeFmdz9bX6Dr4+AlQTByc8yLan6Ttsh+R97sRqsgLDzSX7teqCU0SkAU6xd2u1jO3fOeE2diD7224es0ooVN4zBtAOxfzc43R8Fmt0yVK/SJaBWSRv1+sz8Lbxt1f/pyIiGoKf2pomRtddw6CpMWTnLN+BH2+pgtotnK75poZryL2XNetl1PBaKshXmqxcuR4nSe2tjozYp2hIzWVKSW1mn4M46l3s/XxAQqOb42Ywt4FaO8TnwvuDoX/KYgG7wt7wBJ+sjfEHpbpxX5OFNALlJPmB7X0kPJ54dFgBVkOsfxFOgEJgPMHTEutRKTjFYxwjEMD5j770f9whHynxkAA0wZcREEBGuhj+4nSLGi4b4Edjgcc2XHpyVsar+4ATaSfVbFavwRDPZWq4OKRQM4GTRsoWLo9MND/vxNl1duaWeDXTVRCnpOg6Ly0XwAu8EPmkSrCJAk36PYfHOa7z6QSyxZh+/ctec35emiNV9gGZ/NlD+zjwLsWzIn/DJudJpuyDDLQWk1PimUaBYGzMuqrfrX34F6+9OYnN6Bs6KVLYEfd6jHChNB3TURGZOMwIBezdC4hmOVN6tVWm0a1te5XTZLXQfQG0pfRxmRv8ZdKQWN3AK/RVuiV7cRfHUFDMULz76xLExt+ONfVUbxznmQLdSTp8rTbyC5MSM6g5SCQ/aq6owZSEA/7yCxCa5sn5e9xVIVX65Jw2n7MRqbgKXbNJfq2TpWVqUJ6PUffQDQtLrj+ViFmXHos25FMMNDY8FC1Gy/ckL1GgecjMakBx5qbXwi1ZO/lXa6tkYkaIU/1ELiCMlbwj7JyC3pAy3uNlnP9zCfs+huds3EtgnsXr+TI63HLQMvviHr0h0m8LQ0Zdsh8skPzcfaMO1XgA8s0aOPIy8wRttv4FhCgZaEDJqLY8Zk+6+DIwHq+vS8PPtF7LXvsxYRhMpvQkukxY6KC+mPek7Bs6wWW/a4yn1ihDuEgfeOSHPtVJnXtm6lY2epF3pa327kwZ8UAAI6Ex6NZLvQrxWC3sU1R67puy5Y9stBE8bBLGiC9cTKuB45PJYoZmhDtze2sijW65d1LchSRCmosYJ8UeAKnENg+o2TV56SSUfdczfe7BPzFGZhpWqcCgJinwrr9uvUgj7w/hEQxUF5tEZ4ZrIo54O5uU4JV6x4FvAEqogwFUfhMgtg4oNrITu4yzd7vrv6FI1MK5hmZRMneJ9YcJKe4r6dg6PBma7Wk25iPm9KVicQ+1eTtfESd20sgI9AGH6DlzHHG2b3XYW09ZmnQSFT2Er/kIfhG6s70YHHFRKhzUlSwMPmTmQhYebIv29q3TBsfwGiXQLtzeh1CQ1S9EvNjhlFM7d42rzsd5089yPumU5YTSeDXLW2Aqf/tW7X+RwCiV6whkn7L0BLGvr76aJMo52oIM0wxQUfVN2214rsv4luKzkIJwXbhn6+KJuw4A9u+3O+IrNnR63eqyMK+Ia7H79o9IgtC7CV4YWW4ZNQHLEfWkT/hjm5H3WmUFRHJvQM1D25rLffGOa3TcMkq2tJDkZahLJ03efOMI2bae6zHa4YaemcCPckBVV9mv/bwTwmS0+htGQukbMjr+GatRaSEeDZI/A4YuAoufKp2OTbqC8t2WKaD17R/bRxRoQ62+V5x9Z/6Mo2ctInnfXHkFzn6cXyQdED+EMbY+nAXaUac2cojLj+ZqhQhSFhr4I+BXHYYXlvQHMet/l8Z5dMEfXjUnfE3K/OTe54dyJB9RLUL2k7eZuIwC6+/xDdtnzrFm1fXbIkbMJ+Kp8elYMfbmKIch4zYoSHyPkI5WAwOvFSx6nx0QTdGOCqFpdOxe6QE2fq1afPNzPt2IiaP1RcSF02ww1Xfzm1HfH0KkfppdBGZ05gvTNbUjqB5DLN6epfLJ3TRUVTzn5wIzymKV8Otv8unCZYZJdU4HY3KAb61jKadaRPCeOMkby24UbU72OeVjlw7PBMu6hjWNBw/TH8t/SP0HklXIdGSt9qFV4isE5xUrmPhGt2AZDGXLvQYsHW82jUeiL0AaIqNNdrIumnbWsdxNv6pXYef+wqrPzmwswwwyzVGJQav5qe2jCS1P9xmDAIvpwS7ZalziGO2mPdK711MUX8lv+FTQlDNVe7pc0XzrUVS3Y6lhZqveoJNxfDujSda7/I9wq0mZkCMWMtZZCk9CmCSw5lwqhXhf744OWDX5ISX3DFikJCjAXs8HCc/LVv/WLT74JKiMP6+8K+M7zAsTBsBjsbSQ5iIias4fba7Ldqo/8KwpyQJoLalgafuSvFjpIdM+3NrDksRgpL1vuRzhwo3XBqu4SCPV7fta+sxa0JFxUt7Un4Q/fE2nD8RnhLZd6fSNqPH0znn5uoizyKZUmU6wi5S7bejxhmyE3ZWw40Y0V3lZ5oX0Tu7q6gAZPkQSAkVA6/iCfBCnk83e+XZvU439OttZOZDiqrJk1kosNQKlfNi77aodbbPK2ytoXrM81+ZoN4Q3kUQR1M2nlusaWArqcUEvCR1Yc9+UqLfAmZ0ygn+F4iCs6H9Uvfhlz7ogrhqrm91kiaiUl/uxZyVUHbDarAh8EY8E4yXW4au+DN9+F4jIkytR7ErUmsQgDtUkZMlNIw22PtflNeAWj5kRn7iMLiDDY3GcOq+2Z+w1mMqStmsSSOmGJMAMkwNukTrJetygJ4b4sJ9MeC5L2y4mlzlLw5nBCDy1Brh0QRGeGgLMRqpwexdSiK1QmBuLa4t9xx427WFecdZ8jcLLuqG4ygqBKkiw0yzlnLDpeHyR2rE+8+ZknawEkYaGQ/86ZoTf9nUBI+bFdzUHoSvXO6lJ1bE0WApBJTCLYYemhklvo/wwufD3VXTkxLYG377UkShwaOSRcLZcWeXb+laBOXrZA4TJZoRURSXkRGW4JhTFr9X+CRwyPgZgHpDqzH5uMrlOFFhhZpWGkDs2zm4pU1JnkLb+005PY1qjFxubamwztTOX1llUnC7OuIcu7gck2sPv3ZqGL2EkqQ22DD7/5zuSVunDZJGKwUUjY3pwJIC0lyjf902X0HNsKb0xFs0eIc1tGvb4SlZNnjhejDgIvuJv3/7ly4yVCZp0ulcQ9GYxY/R9Zh18EbhmrTtkvea86jt42YVKQ+uEuBR/ocGjYoXOU9m/OwsqdC2M8HuK1BSUIeWWYQ51AqQ76nveDIaHNv+kH1nRUMsQNQRj+2914ef9CLn3hsbFYeaPiH9oSehm/+L5KXhqCZm4VS3ShnbNed3n0fyL9qzH4SlPVhcPO9wimCVqpdHUb+Fe8bR2zzFoactgUcaw5zdCL90MJ39B0eLLnKF58qOQir73mcAdjWCgd54F0OPQ/SyZ8m3OG1Skb+U1ch1zbIobIj3D7WppRtU6SMwC+rK3Z2RE5GMbMsB6anWRwj8TTC539gsSX1kvPk7PpDHwA+r5ZhPty3+vTrwf9wHIoAF4UlNltfnMzndzIhZWOzK+a6En18d3vbJ6S0HXwuMKVezD+AM9fJwJt3lp9T5flkzdhcICfkRsaVBh7mo3TTiU6LsLFkkgx03XCO0wH0MaSYQf3WbXFQRRQLTbRl5fA7/Eljl2BknWoHYZGBtKB+MRKu8Bt8c3XuAGRp/PxDtOGwo+YL9mC/StAHcPDsTTZ96NzFYmjsZMdjTfECqj/yW46HtDfAZ30+3aa6F0vbVhCV2Brf4RwFps0uzq3oD4brxjpaMJXP/Y3fcAG6tskplwIUc0InktbbU7ZzKX9JGakWrKJyVwfJ8dx4T+OCHhj+VNbBUHaF1IEqstq/0n68w/GHIVOX+sjVzcY4P0UV98/7s6lDCW3im+Dj3Yx4/7tNiwESTR2k09m0mICkEZv7sFdg5Krlnhxv1sHq+LbRbow35wA9uj6poBIdGpM/CzTJYFOj+cKDG7bIj3TEj2bdUTVv7k+meigK/Y8nPuRbs7aDmqEeGnTdo4bOm8YeB94MRzhwA/OV+weaz8eEUnpxkWO9JXheDSpkSdc3HRqga/qHZ7jBBU2DLGBr/23xWasjDZU0cD0K0ODQ/VUjvT3iM7OwU9weYTnlc07MVhC3WUg4VnPaaM3pENUwHYDAa20pyPbocKm7cWvo2pqwO2Qo0mT1O9hw1ouyp2BDRxUJdOtJqEXNuLUSQanicyV8cQSke0XvDuNKJ2zowqA14ANX1wSLKBFZSTY76r9kP45i7hWZlidPqUJ4I283PNRo8b7veImszqEFKaCFxwJ6ZdySEmWgvMzODGVae8Q+UcC8nDHzrHYbtYGjlxFwNA9XPNrDryYZLAg8S6dgBFvCRhb/drUaLhk+WS3kqy8prLgcDXZOD4MDH9AaNGwB9s7IusF2ChXwAdtMCA6sYnMDBYJMcThnt5S1UsIT/x/oj8r2KVJY0Dmwi5TbU7efVmdx1+Hhf5zpNA4uaC08qUZlof3s2qhuexFlwx+6FZcRVYQYEh8cq3HugYKkkYip0CHqdR+z+t9xLra7H8tRTcLuoBPh3JE9cy9H5TmRc+v19bOLXMxhpt9my95tS2iSZdyMINGkP0YJuvw3csIMbsYpRvB4HKr/vjvYjKZpM5mcPKvzVH7xVC+7AXW7SKbOJ92QKWBZ9+aAwFAk80tmsg9WhTxo9YbzoOpTNJdDy3NlLCHl0mhFACY84YDUK4Sczfd0K4VGCs8aUZUYkscg5XS6jHjazt3kB6ZXY4OVHkMB8MbestXpRSOZ4aF1KHkdDNs093tw5FnjprRQTvIyu/gRkR27ySYt5RFga0uMyE6zM7mcir7pIduZGvyxQEiOLeyOFgjT0XZy/j1xt6Rt8YXH9bbMHoVIFSOVIZIHRzpZbqNKZcqDIrVPFBPy2EbzKXT/Km39Os2USUXxMQBUNt88RkGMPWfICus2uOMREbI42r1b+lxMWhgWxiXGiBigCRAhjPgNbDIvmXvoTIAbPAEnPZOkn/fIW5FC3xcdpsyxgmFiKJE/tj1963H/74qwf6nVR1UcndkvIG8wMzs9ftl9xYw0nQfofn93hH5QVtrs+yv9bb9Casp7k4P0kVn4Gpaa1WiIG5u1oRdMtlJ1Ps2rNO9798lrz0uzOYrewCVLAj8IPp7dCoutYjT2YjezKNgratnjG2uUaLzob9HRGpo+EXBha4RR7TCDihR0us++tZLzwprEecbmiYdWasq106c8Oilv6+gtJq9dbxfBNoYjSJYR6S+Ndq2MJOxOxjbj9hp3NzpaDQlqV8olf94OBP/MI99cCQIQwhJ/QW3Gd/7tmzOSJOrwGm6XyMgHXgfJu4ZsJcVn3UkfjZdN6WcRaKvHGr+EoT+tEi5t0WGzg35idz16nkZ62uU2RkzwIIV3attFMJa40wCXPHizk/QztheCBVhr4i3ogxCJ3ZjauJricybtyYVI2NOdZ0YWOSqOxweTT9x00qTl1mHxitH8N1yiQwJ4w0gKj6ZTDjoy2V6Z+O1RKO9gfh+m9WexEBPLajEy4KeaZUu2JNwe1yUV/hRs6vb3hoV/XMhOQB/lINSdL0JPAp7kaNfYe+QqJM/LwQEwZdkh2jyTfwuvy6oDJaoaMyEs8F9/hm+TDHktaIhNpYDvdIMf49pBGleNI/PXlLA29g5XNh/S/rGYutbdI0F+sPYN2mwyL8MnoGL0THB6hseSLX/AjnarFUzfYwsQgoPq9IZBF8oeYZC/xvvsZnfdyyV37LkI1N+yrKyfdPQnu1fwzvmvxAUUgZNUyzS9+TrTocObeO7Lvo+lY1j2NyR5iGTN2QJDOzsYX0LR1JxExfIFOeyi0yHypY1rY7oQth1fEYpIAWVNC4FyyZKAj8viMuhDUndDjGQJKuKeniXKP+MVRQZFLRVdwTfB8c1doDqxi3w1Z6pM7FwfPmURNo8sT94nzhg3Gy4gajr4Gp8a4Q1pVf4nxmwRb8ujzjMobECHC67nbruxu43GUC8QVqTSHot5NfS/ZkWv8Hzw3hVBfmX0Y5azMlVExL85QcfHX0MoSNmNwcrN9F4X8YvN55yRP3oFQU/TSP/IIhj5vnTYtUo9dZ0UZUI4tBxmesxHgVuT5RFEP9L1zeD18Wu8+QCM3KB9N3MSOyA+5tPiCoLIk1sUD4bojA2WeUN57kt5TN9Uuur+CY6cuqFW2T3jVEJqUFh2qQSjYs72a5zRSDeE/wifltNPP/a+PXt0ptSgqv+xMgUTZqzGoIRpP2v+QQZ6JBotmzqV6mSfudLJ5WcGbW7v5IofyxtWRwkrG8MZf15VnJZpG2M5ZsFPO2coA2+YUz3otam6Kc6+4ICJMHLF4zkR02JUWcgQVGW7+CKJWuIfFRSumELxyz/1WCWc2YllXrUaWba+RkZ7kvk9sXr1/KjDi5AMNEIuMPVDXTJJZg0wcS6BHE6Mb1GBtuhuKu+NOK3iCjfJPQRV/d+XNOnHgvNJD90R0AvPmgq+pdYFZlCe2WTOl+12HcNvcLLdaeOHhEmhflpdQpf/wjfvyscBANza/8U2I8KoPuTi7jCLWTv5n/P84Y/0uM716c1+Eu4TPnTKXFvGfTU/+9swsjDHZcmvz22/yNHCxUUtRL1v5J0G40mxw0s/XyleJxYWovSo79wl+0vxaCxCnhjlNj/e+mlyt3VkosX16ZT+u0gN0PBzZrTVDfIRNl6WqSl6+dzc+LtGFCgWHj8+9W74SCOIQmMem7d9wgmNaCs9Qf7TOUVc+eCa5cSc5bSAhcEoATHdjGX70mWAwuh74VbJgWVmPtHN2yGz0KLXC0MF+eI/8CKg76cT0q+sNVzbYeAey+Av/fsS6OtbDo5urXjdCHSZiRrydlVxUYWiV9ELMx/hvboi9qWHP8vOwVBr1JF8/G4BwemcivTvrx6ksJBGeIbNP13M2M2T2QziZ5d/P6lh/B+eEZOVRR2mscttkVh3oJ3X3S29jIzVNCR4lTMQI/1Mool4sR1rMqlsFTNNZ1Y6SZv6pkqqykemozUlQLKJEGK24YExVou2KnH9paRhgwKZBvQyWv0PgIfZliyx05bhE0OGkBOzVPhQlg62ny8rrnFXYDBSumbxZ96UOJDgmF9o+l6YaAB7oi88Y5J+Zq2DULuO8Tr+UhyQUq+xiPbKvP46ZzbjjCw4kxpHwFFPfur+9eEHdHFSY9eVcn2cKbcX1azfZCe1wahcQQOe7UBggswMN0e3mGRy2rEp1JTmAXJ3AF8HhCp1ztTPA0ZywuxbLfZpEuso/dFfvlkq5XYvrgCX8eQtYAbFK55nI7BW73ybbPzWriKsSO9+J3QjZrGVbIufWojIh1IpVp2EeaGlE9QlWbpRldnQODdLfqxBfvohLtLWsz6Df7vhahgFFaW0qhxIbU8DeRmVS/Zsaii+lH16OFmdVyRBIC66mgSbu0qQS0GpXBNKOKI6BTPsWVgqR0fGeaULOGA+ZPGoLu/4dGvFjrTeXkXpUlWEhQJWvWjw5GvxM5oS9n3tX41VxWDIt9EAcs3OAQbqc0tIws6OiB4acp+FoINNedQA/hVQJB9SLXvvltNzMN3y6JiiQXB1H3FLwlgf84u1Amj8q/0078KMlaQxDkSzRTWM6kwSpUhqY51gDzVzAgAzhHoE1SC4ZIiLiYcPbNznbxlPSXOo8ZEj7X3EnC4QK5o2MmBAMGY+SP2awD7e1aEy6wRzz2jtYBy7OO52gujz++VunnqoJ6Nc/EOyLlvfrFYPw6gbFP0MfMPH1uGblWPhii1MGlWYrBYCCWUcJbQmi6KMbaFkywY+mY0zhU9gKcDEB/F5i8++fvrcRYNR9G/LvwbutCGSSOWN9nJZ1pYqIrBVrv2dHCswoep4eXFKR6IAmc6Fqyp9rwS11S0mD9GVh6K9Ae0XeAMoEeI0h4F5tCdp53HyXEa0A+8XYO23a4qmc+F/dHMYxXUfrGzAZn7YY0h7JNh3CzNWMvWuaeZlEHpiZ1yW92k2ysFuPXDnGaevziHxZeiM8COKt5L07XRbLLYdhAbUiDVT7qbMLwBLYwcq/SeB9q9GHa50ZaYGuihHeOZFlaioUSJiGONt/D/DnWl0XXEfIw1nUjgj92F8pZLinIRDZc2aiawBQaIQXRrm18Xd4RNGNGxhX1pjXIlp0vtSy4UzV+RpNZBNnQJf4k/Nfb4LbaPSlp12C5Pcc+mH4vaRw7JIO4j/MpQ8LWms9mxG1NRSNH7HPdtmBaPwpUMtmmm9Bvuod5kGpPh9UJ+MBp5k5jr8KezHSWP1joP0g58hgugew8XJjwzHz3pDjeSEgVgWrvfgl09q5hyzuGU3iu51eILayRSV1qZLP6C26JTDAtjkQXb9EDdE2BcIHw6LjlZfR0ua1+1PnjeqAlRTLS3Jr2jCu2A14cJeohvSoD5fM8cicocDn2aQUDG+nLOqIZ8bjDVFUEEBYGcgiyka7pAp4LiuXi0e0BzfYZXhbDSEkVMyIdAh/dDRnDIEO6pgJ/9TJVSK++cqsWoDF3jMYfxCZM31it6CGPyB0/doKOXZNtczun9kM8ymw6GroGV4cJ7qz/7QurZSC4V2nhUq8webosPD+Are0h9BYUbpzbveUDCnsX3pZnoGHoMbXwRFCQqwx5ADHQiD/WW9sDyj4yAJipJS4TLjyETwcmFvORiIH2GnXAdz4Bhjf3q6SvtrxVX3tr+4LdBM8MSoYmzz8v59SrEaAEktrHFLscaWY4UoljKkDHvRDbbU9t0wxTIsGJwQa/Rx7RYQ9YRI8xiX+3Q+fDidszZx6c/Vb6LnMDaGf+3TbIGSGXZYQhLxu1fbuOGsQvugCZ1YmpJDZpshbmNUDrYSoZdS2CI6Cwuz6pZfKHLKKGfeLS3TSmMXJE+0oXhUKjV2H2XrqLRCd3OKxa0MasJavUEB9H9P7b7BVSAUW62gWvwOCGxsIcfOYcVknTbuX1RiJYF59wJWwB1NnA6QMQ9BK0oAj76sZa/+mFz/48XBUFcEGq8sqiUwYqXsGRetO+nNRw1avYE+MUV0H+6kCq/yWVbCjlMybQ+aA5DrpTXMQoSVLYybYo24mUkDTf98fno7ZDMhgckGd2tXLk6xlMBOp60Yxsw6LoxCeozlBHxk+hKomq2r/KHOZH+H1/2j1QfBEhnrTnwItswCi43XNhY4Ue+ENRI02Z95fOxQMcjtH8ozZOOI+2jUYxwkdjdYk7y9QQZeDu/fIsjEWHAmR7SPDcRy7VYeHtALYL5ylUx4eYgl8ztLwJ2N7H+2LdvNHqAbku2U2IVKts+jPkfT0Ia1UV2X480PHYQHrxc3jxPgO8OjOw0J+V1x/Ls0mz0oZqFOUWlcRF/yC/u/ea4kDX+gHTeYH0byYFh0cdi2c3mYbkEFM8tCwrCGBl1x2kKXbavmNNlgej6lmZEWGeif9ga7UxdZ7BzungJl4PqA//zaxpBEoqTp77Pk53151CRDDFydgvaJ38GQpxZitN1fkIUzw+5RrwscMTLksW9xK7ksXZ1Re2DKjTaRd7UJT2t7klZHHLi6D4H/2vHhs67xEq099eSSEGKHQk7QJUv4UScPRLPivYFbX/6N27GkE52uWZRuZy4xMJMHHb51m6zVJMjlRnaJVu06uMCb6BbwftSsDiSNu0KRJGLE4T6PsCEP5DKPSIxmzKfk3woAnb/t1daJxnBwSwnIf9hU5DqDm4bMvMkpVVTou6JNVtyV0nfjtmal92GJsTjP0OoJMvBfaJKp2crUW2iQafImOCAe+zo9KIwJctYjTAEawlv4F9hFvwP8mOCkEqkK3L+4UKUAb8iz547A8tOBdllvOVw5z3JkoLmF4KNJh72MeylTgCqCys9p4RYxY/lDxUMVreWfGJ7v7OnysqSvcCHwhINbZdEirzLuiyme9zJnumjgzpjUZyGGyjMyxLlaT6sTzCj5UCu9gxHAXdhGB8/KH9ZQnbhsPXE8i7SDcLQYv7QMXiHVM7juAppgw0g5xtCzDF8HHH3P721a8AHQvwMXgfPyEBDTPjOeX3I8S/KI7Y60fJ5sYZQM25T0DaB/F4o3QZ32OsTGTdpAxqOuo3V4JtQYX9ZApNuhg3m5IRtEQRvznIN4G1YnXRCsWM77S5aoP0tZ4a3n/uUDUZO4I1aNP6dfYLWu16VJnI+dpy6IEvrHzi/kK+G5aGeUvYBO/rcKdqNilNC7r1XpbI9wz3E3bRiJIhxFJ60UFAAhFvD/LuIAZYYcVqHHBQQlSeb3RGxGJ8GNfWsE6UxrLHIRGPq/E+7J9nsU1/57MZRMcfd0vNbaJEM4vlXHjUx8+YIhs8Dv9Y1V1yiw5teFCkIF3nuY9QV0HnOjIrqiJRPBXrTJ0g9zL+CDhkBg1CXKCr23CM2YSGPDN5KtVJrii9Di+JMttmQUm/ZEOI1QGAz4NxzwF+nKlbs+zkeDLkA+qjsFfPeiLfuxopZ2BRqmpPyVA4KPzJluRrXd86V7sNV7adqpszLfzhuiX5kZ3sCHRLvOMmz87LS3N/n6CukyIqS5D6BzmR6R3Lf/KQIak2eFAEYds83fwSAQWesR7Q2s0RORXTFKsHUpv+AgP6IoJgSLR/Avyb2XgM1LWo107sMjF9PZnUm0YkNmyuy5ndQ+84JmBoTEtH6U/u8qSkls2Q2E0hNighfMRqoN1F8a5U2HhLMhvAK6gSYBXzGmdYX5pTRetEXMW/Nzxr6VIYbDCS8EsKRXCwzeXTVNpZIdeJaDYLvgcJcxfV99M9uB1GpR0FvSJqZ3N3TcKo50lspjMUHEgt/CU16+Cu+THcxfjgTGlejOlIqDmyrPryRG0OOvx5TbDpSx5if5u8o7kGimIv4TXKq7qSyFHEOyPhv4I+KKwg8BNJ+hHa3cTPbJlKCUeYDkPBRs4NGnyrQHgAwVoc9ueJlB89lzBPe/4AP4xpg9nQmVyqxBJG3VmSmHjPfWWb/4BrdxzYFjDmAtPy/oJWLgp2l4x+jZ0aR3WZNZqVT5JJ5Dt9g40Ui87/Hnj5WKwMxd1lONZHqwazmhqQ2zD6KidSI1Y+9DFS/5sMmMwTlAlaJA2lyXY2qt6ywYulZ+B6XkReKYESxS875v5CO3kIbIVn7lsCmcFGtZy40eduP9a2T5ccQHufYK+SK602o/5RmLS61BX6vx+1CFesjQOIh0sgihhML0fMJ8s6d8fwNBrrdb7PehK1qWtKFCoFj5nQzWZ/O019L/eSMD4TZ2IHCnDkNVXLb//d1mQUb3QmkCUvSYM8F456JoGMZR3Uka1QQo3ZsjGP82WvcUJecqlmc/KwLxFwUg1cojR/l8tA7gQNI2g7oSWbni0KquVDtkZA44cHiD/pEDVzqLAauZwpN1Cb2eNWTSbyAOrxbj8UNAeM8HIIxZzcHcnfrAPT3xqCXrFiWYo6ADLSuwQJYm/t7pYfMurOdQ6EFeyaB8tD6+ULgjlRUwOl83r0+92L19r2ZcuIr1w6M+ZsXV7PB/pWYgj7KzpstSTX5wHPNWTG5jl5SbAeSLY2hyyVWZhh+ImlPH+O+Vli7azu0AxnIG839dkLTE1owk9Kx/Zc7jhVycZJjk5SsyNpiBMvOcX6z3QUMN7o1qZRfOIlb3R1OGtSX2Xkwu+sjngaNIKqQANNUHfMUkIsJ2eYH8nonbgdHh+I0IouK23s3bWl73IG11ggV3zbm6dnjea3nRTSxlLvfMBYIAvTtjN5SqCE3ZOkAe6cPoAB3fYQX9SSMnpE2/NvqTBbxsxNM6xCghPGWusHckDyhyYzGsCwa7DWj5fhe7dvzUGXJuf/MCUK9xLXbYaIGBdYa5TgRcZIO653mZ2J6y8szr88deDul6gl2BygMMcU+ChOqb2JgD1djT4QDKDlsQDKJ3FQk8F7GXNrzOQKAjNuHr85wf/2X4PWxXsShGCzpg3JJ458S7XhhjZBDWSV0ar5JVbuX3Sb6ZuVI1K2szx2HpH6qW7yoknWGzokBsHBqAgLiUopXPHiaHjvxcBjWgTJeebiXZzNtUoKXx9NSGwVVbLeJ07gOmzG12lqN9IfEI4RiuzSnTHPWhUdyF+RBByl5jkxbx+OlfgVa8JaGzmd3JXngQNQlUDtCrVe5Km5qatojvyeKkRKWyY1K+jvVxKoto5o3Ew3Ba/9ImHhGHlXsgIw7Y76Zj4JBw0Q9KrqkJXUPS3W6Uv1Ib+ODj0oEIZQCNbpwP+arLYC76c2sdY75Xp6DjL3Fpms/3dFbRZWDsZe7qWuxypTg7obSvBNV53A0ZS9LsDkQ0oa3IOxLDW12++Aphx9BgD9BXLxlZTr6UikWJt7khAWT9v+JbkDX78ttsupccmAcwARfkmeO9/+OZ79Q1b8iEUzgl4Unem1SZyPynUarjFrIdj6SWnPtbBkV1kTIJmHWYKghDSOTksBM1drZ2WpA/2BEqOy8eX/FG1n5ORxROeq0pMX/cjuEeFym1ENpp4cRuYXHZY4M7w4gBidOM3LJL0H0Dql/5iucbAYx/sd3eH2FHuYAVUxHq4YKmQqgxIl2iDyckKr974FnmjolmragPehrEIjTkHvEpNWQHY+xc6NIGjH6lsTGd+tbGClBlfEmKyQsRQ8/9PUjprBci8miJ7AQh+LMdS3m7zExepWWn1LDc0FfVGMjyx5d7ssa6hsiToT/r1ZeSP7SrjcsgPZ616+FAiR74+ssj3JREU9EzoIFNB9RgvrtD9KXBE7UAqQlR3z5GWSHrrfvuoG26g4TDHEJwPg89aC0shTAwUxC+uaQyzmY08peOE0UjMUbMW+EZLZRolOXHZuif8FWHE0/wpuCNCkgKDrWkDH67XKV/xlGXDIGhyQWJMu3HpS2dEGfGB/gsSd7cmPuGW5f4EHzzHfaLOJr4Q8CKh3Wrc+bJJIRSSa6+zhVawACHr14YbMtpX5G91X24CX0PTOHcA6eadgM1+F4jUpVCocsE+zktRemTkf0ZKis/J1WV6Ar6s7zNUFcTivz+H8l2WUHK/38Al6FAoa3M9sMyXHa1gTI1liwoM/dQZlbg2Pqy2hsAtQG9dQQV3z/A0ylHLYp8HtZWpQL7+g2Mk7RbRRcGafvqpnS1wwu2emMjQW0nmjNglIMDOR1RLNOqFn5YTxD62ERcK/jiRakOd5CMgiX+lz6Xe0U8bRc9vtfiKK5KbJR3Dw/pWuvjuGjA8PjS8QDhAYIibVwhXPNGvsOkbKSzdnc3NHwdruekovPty83PDfcDK5DWg9lZMoQJf+0iWsSTWcJXHeO/tpdLW4L5+Z4ovhHpTtAQWfDElNeyADvFlGLCHS2bnPCB3llFD9XdTts/GjM+NGqeNmUCVxAwMTpY+dGElY3hursXUw8HkAznRiQeAVWFoYh+GaJtSPsm6rgIcuBJWMY829EuD9qqkH+wR57GSy/5AlOOx3dNMEO32edJvWQC0sXbXWr7Pp+L9W/PpK/qFRVlw9yp8NU+Fx7dV89T59er1CnCoCVRh6BDOgHtTIkWWz//F99LiB/ebhzS0ERGk+IjsTHxz4hTW5SmwndwdeRDYItXBqPMXKwJCxtu2xH8//Wxp6UhojWSOzewzKmu2Vr6/yNJrEJyjv4oFHAtvjzM1pr7TaCl7R3A7LmYZ59ZJ1G9RfwAuaxBEW1U+k0JL9IJfk076jiRU+mmAra0qLbOPEtK0VeRNB/wdzgPCBIhimNMXlXHFeBMy21kePho5lSCViYI0tvR7OSTnx54rYXMsPd2T5ok1tdgIUx6sToJCv4k+WBBJM9ijU9bIW/TwIBQ8IlrUeOScQDpg15rtaNf7MHzF8qN8knlCE8ghc8OzGp0MT6yOpvCe4Y/7gmqjSReHkwZl0S0s403yMbQvv41+siFIgOcWoBG7EP6is6jFBYmWBRqFK2EqXg29CWTfN2E1NkmtusWdX5RIpcgQwCC7t9SKgvyhXtqaobHeGGSXZ5Peun827JjmYpLSvcFRxuCRJZV7bAn510qycuA0tbPEXTvk7F7SyVilXf/h1OAkDpZQ7N8Ee00N9/FKV7RyF+9m0foBeOTKLAwKRPnvQtHpkzzPjJUSiBufdINkPc3OWbfxhzaSqiD/beAvvQugrKOoWZKuAwLgXDgMOJG6X4zVMHzFSpZgykSppVgCpNwyXcB5sUbYH0ii6G01Lb3In6IjPp5dat7e5zDANZ5If1wAEnEvvM70gfzPGTq5o8cV7leW5aEaVdccv2M+zLcpGrntevleYdABGQNBMxLV/4MSkqBb5ppBDCPdbAanqLtjpMs5W6kIZcrztJHjyZSHkkIX9Yp3yvZ120Y8ltGg5ney9TOuObo+9zu5ZVB0zOGQFP7Hjn64GOS41vKVnEt3wW6tPGeOvWzZaVfYowcvJnQxHlyCTXw6IUbFmQdkP+GNvvnnfNDvxh/23unn9jhX8jVcVVjm7utkkKqahMobLrAyOgbVlpezxj6LC5jcq44FZ3dUFmOP0Wq5IbB5jsP+2XNR0P7l4oMH8woIvPv/FW0tLbwV8Fta2CvLtyPbs5ILs3uDyyRrnoXnRwGeXZo+30Tn1rJ4MtKq90IoIZin9RtuZ3JXVXiLl8N5ybMn8IXP6l0rNtN/j6fIbePgs45cHpNhbDCIcqiUMGdgnqSEsJndPxqxzjzT8gWhQ8h4X0O9N0h9MMp5zE6n5lS34mYquUj/pNo3leb4IRQB/uvSvKP06+yI7ky+N2Ym5JibncO273cKk6rgQRlOs7hLWrU1/mjQyBsDzu0kNaioMYfunxB5K/+WoCRSMUVDhea46NK9a2T+o0RR4n3yA1xnqFv3fxS+Hgzlm10+KzCQfSGhJscK+elED+nljRteFnXiGHQoDqvxS4sKsHW0M4uRWEQlVj4Bn1fVNfLYmVUMPiX/ZG2dpcXp6W3qeACHOSGa3ude9npYFZhs80FmSFE9VDDAGC2TXSSrJ//kkL9mNiuk/YaLMeGcDRjLLYydGeJCHL8XmZA8pCACZfC7lDce2iIOQmDCzb9+7rlblb1pbZQOxiZKaowOeEF9rtIkHnujrlsYMkWsvXR740sGJu1HIXcUpHX9C93fsmbr1//JXrulqb/hhvMl1hDsPZXpzdPrRn+BIYIXLBArkLAw76HDIMYhETpWJm1J2XM7H7UMZJtNCeTniRpBe47Y2FBM4SRlmjisgw13Jx3yD38c1GE5pV016OquHtVmBmULyyd1NDP1WHnAwUT7JKkpVRE+SVEBV1HcMHO1dzWjbfccT09i/9Iz8EDuDpUVXwaWLU0bQMV12NeAWg9LIilpDmjp2BlN3CK4tPIxlHZHlFmuA8H4Dvxv7vSCWFyOtn4WuIMfaHcb2fC3+7fKjQ3JPxVQlPUw8mREbf5VGI+yFak/qTnT5Rc+WN6ZXO+N/rUVly6H4MiCl88036ck0e4pDI1I9EVoAGTkoBSeUxNSQhFQnrMQ29js0Epq26rf8Zx1tBgOK/v8c1RQqO097QuBsAGVFRi7qG93fj87gkUX25TLG5Mhb5NPUgtlBQneiXpdVKn1Ix1VZVHk7pWa1UjYwMcMqlbc4lTyP6YTRGtQJahZulUogzJaoBLRmOVGNdvqOdill//MVUEFk3GIpD/5JnSL1eE98MsqhjV0BAFZcpbUewgrBmDtN1HIcFjEbIjEElDGyUXhlr9d3cqMCqBzDSqGO6v1SFbOlDbb0oIVN0hJOWw+rUo/MCJUIRqneOnEgfvqZPy/XW7eubwsWkAc4f+Ov97K12AlJmn3mFhN3skmBttplStsqaihON+ToZSxehBBzRmybJoy1qg3+9aWc+02ELV2/iluBgqUX+biPydek2e37vJo5XGihJmbvLVhgG1REuO49dkKI1SYnpHOAewP0Oj0Iq/Sh3yK+q7OBR/W/amFHakXvUaQJv9lbs3xEt3Hv4eE93ZntUojiy0uN9S605bU2RpMPVFyi9JzmcYkO4k4nMbp0Uej+2AhtDCLQSb5GZ6djwZpL3YrlAf/cP2NXeWdGxz6bDicDGDdpbznRmSSWeTmjlcS4csK38s6q6J+GIjojtCsneuedc9tLOKQnVzOJVdbqPWsrIpcWvcXJyZYUBxsslKzN1w6PyP46oy/PPor0+Jw38YWt3LdSZ0ZEEfD2CURs+jbp9GZDd0nL+6RBxOSDOuSbmGA5UnsHlGasCkHs9B0shFsyxRchcaZrpq7MODt5ByA7GPcdfGviab3zs1Fg80QUhsq8K2CihgZLNcJVxY+DWvu/WFcoknDAnAMFNX/eKfn4wHEQAnh35LZZ4pp04cAhkHkEW3wQECahPOKzq1ESkknwFj8dEztWYBgBAcXI3n4o+4qYq1Dk1mOjoYZiRTFHzCJeEJOJ2SmWPNO6fdYgsjQALklN8cDE6DwV+gC80PO3eq+gdpKT/d/EdMjqkx+cRA6/E74c8Lj5ROi2oQNzfgmLoah3Yj2nhcrDJwiKOpY6NpoYJq+lksmJkn1KonJHs7MqTCnNdphg7tUwlieuvatVDNXXCsuIP25XXN7ICcv+zHeYw9XBKD2NdkUMbWvfxGJ1LRTSMqN7y4KPm1uiDAASgZZGALieZV5vHtPOjTOHCflTRXAlrmndQfIqiBlZ1xpxLaVjhYwtQsaRTPcuYaDJaNCz7/ohxTfSQ4rlQ0NAXsfHNd6h5rLd9RWOdJfhYi89b7hpgJ1dLQETkN8rV547COnqhWaZ8eIb3EP6jDROtLz7UyixHGnLJgcRlcDUf13FDruG+tSbWw23ZfrVrDLCUy14CzEqfBrKEVKhXx7zhIQZ4zilVn3BbpALeBz9edUZFkw6JoPKahDUjaTIpHi/gb0BGwDb8wtFxzEvtgwrCVnoVvcqMwrzuKQBTR1jKrbO+dNjNUt2NrU5QSIokUDPtjDWJ/TSgIEEfOOdMuMWA8tbWGmwIAJfoSX1TAHJyvAppeW4FY7PQgFNyCU5QGa5m23pJv8B6yZ28IPWc2jU/s7+Q2jPRKVC0i0xs7aMp68gvbM/8ZFzECo1RaBbrp6yzLniHvPVDByAHUvqQafI406iIwS5ExYpXh4hjzG7thyIAbCMwe8gEdlzduX60Fs48saxZ5XcXW9yXUAyLMq4cnzvxwE3CRiw5UkUqXZW98V1Uvg5D7hqaeKcyOLiXmCHXifCoYtyNvLcMT6Xvexonp/lR29CFw+3wxPOtxtPMWFlprgLwWXcw/wZob+Ljeu9oecZxx9TqvBkgcrH5eIgqow8iiDwOkQitriaHZoYab7n4XA/Xtx8W4rH6v3FNyJ0DMRS99SqpfsM13SE+wrJFQN5EkXGYDMRuQsDN7+HNPl9X/sTnD/RcJnvbiM08OyrM6MepcGFU4pqgeSeC8MJ8OGpwHjn2lSzwJhM9Y0ixjZ7F6DUc7XDj94hm3o7bePAAXKcao6koSfodSQz36ZLGomqeAst4TGq0g3oB7XdutUBFu7KmuPKawiI2h6hHSwg/BTTxKs4e4YY/CUVUEm7X+lCSa+9fZOeOXqzX9kVhMIrN0D/yZ9Uv8eeTGO9pVVQjjYF+NidnOeBVvGE7xTDoa7OFi6zi28Q3YJ561G1M4RvMH3nvfCRYpfVp8dsGzNrKv3qn0EXCS4cPr0hhIy7NNSLgm7VxxF23JLEqP92oevK6GeLYAkRpdLkRecYgV15GEDrEJfNsQ3VjfaWvIJiWE3do6XrTYidEVqvn8ZGW2XHCgm8CjbWXAL1bskesYFJEtxPEucc7kyB7w5kVja9RyUtON6SwvNHGU44HnXj2P8bTVu9MeJKqUC9YscXN4xG4HD9Nh2xzCABIrwJWFX0EK7sukaUDbvdGqZNJI9jbXB0EOerJvXUrh31oBAk3xtJQF+LC0rjffv7KdMMkjzFYQBX+oWRwMwXd7rj2MWR9VhkXUiAwfDeTWxUmIeGHDyPjVqqPv5BMqvIpJbe6ApENprF2n6UnN6GI8rAGC5cg9KZNm1F4mDZhiMKSWavL9d08DbGkzb/voxXfv4qPzHpfFec/NPrTwUPk+G/P/Q3oKlu/LQiv03QLbSr34sJtr5qiUEBC02H5FkUMzNAK+xbi/C1Vh9EMa6YOxvrifT4yt7MHV/iG111bjXMqPg3wY27zU9uXPhvwt1G134b52B+EKGaHoszmQEc3uFo1eqO1/bPutR4lTiRBEVlxp1wd6zFvKr9jz4kTgn+KVY8C7tFnZBsYftFeK3rEnpLfzZLiprAcFnBX8K92OMkbZpk4DLWt0n4Zim0IYUUgJ7k0ATRjbZBL2UYWVA0idKg2XtREmqT3eBKDNBpQ6l4Lc/kLLx5OtfDnM2SdY3W3s0CxCuoRT6rXmNu2uGfA6oHBeaPTxuU/kJpLQN1uUS0GUHgjj18iyiocSmJ4+oFGS3EIV4jSvp2qi/2pwgdmXFT4YRqyDBejxxYpt3yuyTsvN9CmnU1ySR85JMNFRAPHkFoC4JV4WzdycS3IiiUXUoI0y286H3MjY6TG3nh7pemz4r139q+PnIacV9qFDcRIvOa4Aix+jZ8NY3+RSutu2yeynIXQ7ziUCp/10NdC6P7fqNfOq3twAvnUMnbhiSY9ccGoygM6leqL8BxR/gEHyF+x/uoy7wzHvgLnomwhmseB9VDxVCCYD4oW8sMnnV+3Dr8tkBnCnZu5Lxj5R6ti2cgx8KapIJ6uKdH32Aa20nedfQ3e3moHvcqvkiOb27KbuJLQBQt9Kcvyqnl9EPYqNmcx3eCSmJVryxs/zf7qnZXzK5H4rxv5M9GF0qBpywjlYn3ROtOh8xrG0/yw2fjh+9Fr3I6urwbJY/C1cRjlTDuOYY0TSuGdf9/z1lMkd6F41X7hzEBBNBv79T+TITA0IFKHl3SubznLo5zSlTzXnsz6HUrQ3WHY3cVe7/B2/eAN/7y9QtJenr5qfhWWsfDeh8U+Wf3uUWQoq7Wq7SCrtcZplbcUn5Cg5G8vQynumY6z4JvbhCrmbDGf/e2xUZeHOLTc27IoRHnu9qOVwA0cjj0MbIElqFMttEHXKHrmISJCiopbfWa+UUqpp7SmFLoEGBWggHJSWDnkitx8u/ZAxNM19xZwm5s6mTrMFFN4ARhZy2G2e5Da821DlBxVNwV/qbeyxy5I3KbLblRvUd8RuB2sYeHRuMfJf6WvLJFUI0H3an5oyAuqBJtHJV0cc7wnjJ71a4AHnvHOqLhIq2qTdh9GgZqTg/R+1T+PPmqwmcjpH3X8xFPJag+tHZPvyb1P92D9i1OpkMuEoB2qm1jkDwkWt1tcoYrfzx8GYD6WtRNTGEbWSAbT362bbzbkjLs61PfUfclBsmiM4/cL3VYr3g9Hu1InNNTFqRQUldEDxo3pdEDiTdbiGrlEG6HQCn35y8NptF82f7atoKRVZKEgPVWi/0hhGg8epdQryT4fERxYHaPZLLlxt2SRbgqhJDoYX4t50m+neMZGU9/E5CZwkVseoNIWrdE+gsrEXSv2Y5eogPqRTRYujJ5dH5UTj8ivvZnpu1bE9HJUoaAMgF9eoPhM2hhwxJP3AM4/Aa7wKtSIoBDNpCmw++r8I4Ln+j4WIapBSgpqbaXPaUXjLCzgxG4v5eNG57bWayoo78InV/NLjUyok9eFgJRenyVlxRjRbfa8ml4dRRPEJL8VvX/3KES240VlJW/NUQkYZ8U5JvtPj0TKg/w4K/qcKD7Cd4brzliu2kjvjA15+JatXz41AHfMPlgjIFl6Vx1iyX4EfIFWa1ZR149WJrW/hq5XqxzHGpXGbyudUzSlXRZgARRXBUIhb1T9FWdW4PigwR8lomnaaJfRbZpOkCipyKxHxC+B7mMd9PpZwfQLYor+6T+FaA26xWYJFkVPR+pH01cIADv4Z8G9CRFWGAFY0GAHvu820wiNI2Ursqm1p10w76+EqFJCajP1gvu7Xj818bMZ7E4+mosFgXEFQNd6Mct+po5CDOXiVLR/SgFncMJkHiJ8Fw4mvY/Z65dUBPKPE3H0+Al64jahBR7dgv/uhLHjKJ4m4ZuLUlLo+unzR3BuxYlkeFQoaQFx/p8B+Nvqy2FdfoEHckC/VCytLf5CL6g21cU+HswNbQOjA0DqsmoBbTbR/oHxad6BSxG95Dn1exlidxv0A4DdioUSZeiz286T2zCZYtAfxhSDDnM1CKuCnblOiJmJtd5KS6Zr66pYq2lI2SX40Ex0w5S1Qyv72yV/Bq54ozwI2qPzs+6Ho/A69NqkyfC68TJAe4v9kCBfCpemYCEPwVmddILDynSBDeIw2GnhkF+VbfHNOzPPGIpl0tLe7x7uVqv7WriKBDyulO8BENXGgYLjRIvGZitSyuYgGAZ8hxc1r1UGZJVJuH0n3oN8OfIqPmFytuI4TY1mKnwQljBql2G+s1jOm1uw69U19J2SxMLDOIJNefTkB4bmZHwTza+iBCe1IazeygAc/2mq/I65rfExTEndN223zG2zQkzVl0cCIZ2oNLkY3lvDyopbGAWm8MB/ZUrtxsenQ6sspP9PG9h4MjDXQvwAujLU7bfQ/XttAgU4sqjHI3MvpyNeajuuWKvCRueYH0+YrTYEp/IHLMdUedBNNjCPbJzkwtsaGcW9MPtOF84VxssRiVv4Ifkk/6XVGGYooVvgY+I/Hsn2ivNLPAw4UB4Q8lgrW58/sJp14PDv/pKv50z2rinAEXBTRVKa8tgaEozWf92P+LLWGXpaEEab52os9tUgGjhbJv5H4CKAbjhsxAq5E7XYA3B9NJZjPpnTrpnnv3P56u8Td8pVg7oHosFwd4j5A7DD/u0L8YvkFWktkYbMOFvGHkI8/rs7JJAzBrAo0dy6MhJZ1eNGe/rJXFpp2HxtEFwhCX9Jt5xJANqcGmzFhyczgk4o1I+/WzfClci0ZACRCyrtwxO6WdLIMil13R5C7pHlEdae7n5qOD88tiKl4I63zMSgc7QXtoF0N88U2xUsJE/VhRx0EiOrzUHXMz1vj+krd7sEJTh16RKQtItYbpyIAtY0mZuEU6uWyg9GOaF+rEYF3GJxeTyoAPUcfle2YvNgrnUT8jIFMdlUGnJrBQlNEKnzENmybRKioSPGGpcY1El6sDJP8n/Oqz+MeIrLGwD1RPJN3WpxYhw9a9If55uD5RFDSW3F2WpQzsOfOJYsGY3oO3YWcHJwzqDDNm54aXEb/ZUzcuezBmSCKWpGpKEu+jT2BKyVquHkryqYStTdilisUm/7BRJGnE4Ko1O/HUsBLZ/nXnT74JrMd1PrsgqT1H/VrXow5on/dowgASDo6qW26quOK1Jo1kFeHK7XEzvlFLla35vzxRNwRbwsHmRQRjvKH9AkgVpcAyr9K2XgTS8OvijXABXKHE6EO90yaerzzFv8Ox9oydZUj9cit175kiZ0Tz2KusLDxIReNI3mGDYXPQ7G+wQUg+7+47aeRgexn4SSrD28Pe32VagRAa2OOUKYtRizHVm893QXx40DnLFELxDLtMdHd/47yyxEioU1BwuBsIh54i3iK35GawVswgE4RQb3AKPwqvcP6d+8ywoDW+t3dezPJh5oUJV4KeSPdFUiJAZz3aLypqVUuUKGylRu4i6giJ7GwPJskGIgkaTuIelP/H2/thEIwNmkHrH7ZXD6l5jQGHqyafg/DvnQ1T3V4H/4i5+3j4oVD4e6rBTr3Id3DoLnRLpCyM9Ozz+YrD2HPvW1Mc0ahZva5AM1Wpce6nrD8IygV8uYBGruxBp+w6V6UkI1Lm6tq2v504foqwpYrLfPUJpy2j66jAOpa9IYNZAc02JYlCniuqxmvHvB5Ic/eFo8NbFJ1bBV+7+NEyM9Bw2oQdfgbtWKmR1RMf7icBstd1nEXZUDYkHTURL802Vr/ZQu7Z3MbXcYjQr+PN6rGIlkclOhpzjy4Im1MU9KXt3f+DzA3AibVcLPW+7pyLwGoYqktyHqh89xSD9C3pWR6bl869YLZGnnBIdRUD8LsWcvW7rHdt3HEV6L6aAzqgsp1BQY8+gU7VqZR/mdu2PRKg7ny4hTnf8hpJa0PQjDX46zIF9Smklr+ueGGdAA6uPzk3VJ8CTZ46qA4mzQjaoCOP9cOxpHW5+7Kkz8HfoXL89pX+WpY5Rlqi1Qs2BkFKLHkJCEcfd2cY14nmtz+oQaRgqVyOeIit0QvffUwBz3DNjv5PKvVyumC4LKOYGTh+ceZUnaTVeuWH7i5RUrpz/IeLgMFhK9umnoYX+ABpJemimxxni0bFOYyrGy2aqaVLE5Hy75A+rUArm+oB2N5hYCopMdkeXpZL45IiahVbWJRYYC0CyHl7S9IXIXA9k1Oj7OdVOlYzMQ6J7CD2EtHNh7WFEE5xCwyghpzj6mCcMNMHJ92sI/qGONPoXSoZv7xxfj7UQhfEdZ+dnLI+bm8ZktMOSwr/3oVeMaAe+1KxtEBja3etOEL1LVagBjuEpnV3qetPaW4nXDIK7g5ZLl+PhoPBQofJoMd1UrIdO2obu+JVLady3/W62Lvw4X88yFJUVP/hk2T0szzh8u6f3x0x4NMW844/j8/ePWCfhzWHjIEE3gibD4Gd8MONNAaDbOZXFDhu9TceuUw2wlOMxCTqHzcejyozTqF2W9n1uN+1jX/36nKkCANnC7cvoN+NakgSA2sWg5XNfTqUTDUDcd7g+UzDyo6d00dO+PDhlWyqTaF14P7lJtfHfuii6VdAtMGHnkSD+Qu4SJrlEpb0FxvJILCzf3+uOqjwfo0VqeSqqk4DhEUimKMR7YUKugZ9+fAtSpxqm8wv1+FbBWEyYx4Zi39LGTUa/0oCEongL2RA6OhdKHj4rni7kmgirxzYkNtbLL5jZ5C4URbFhOIo4SI/Z8cWqAsL1tmGBDp5RA5CM42HJeBiakvs1xE+RoHw2UrVjvRJNvuapMW5dg8CTmCpWGWjhLr31JH0eguU15/6TjAeq+qynyxzXIjbdsT8uO0Lp4dR702KdwxOsuPwIfYKuU4uZUdcQXmNTvJPw+YIpMUfbmrn0q6R1l6SHy4SapL01PvVB+TmsPWGap9AV72J3CwA4GDhYBbIAKgPaqg5sUReM0ffe/9F4l4nk5RxdBtu3waS/m6N2VRoUdzipmsr24A+/ccMQRNh2IwFWxQiAFjyzs/SGUmVf5mgYe9cpPJXy9ke+U5qJhIP24PC/7V1Z24CytOw2T5+7Ba4QC0Q283OvIW3jjhG/MhZNEsXvf5N7uLzulssaDQi2OPOhcmb/H0IZ6My3NphQkN63OSH7Ckx9RcZ8HCuBNhOJhzVdLmQBGApCg9qaFU8g6oRuKLINkXlFa2DdaRWRmAHlWPt8uuxIl0FS+4Xz3ES7A1AGKiJfUmADAHfrqUDi1UYzRCo62YK4JDJFM0lfklD7+uNO//Vp/cncE6GY8Dc/4qiQOx+VU9vMPfNiKzwN8Mcn1MAtqNTXVkgRWdHrxX2J3/vc/ZXNwh7LAUauQkMEg7ogXdQ1ikYcCzqIFUa6HTjg2vO1TFlEkGjjxdxLblgORbpERRy4kiiNHGYKAJZBxZvAWk1zqKmDa2gGwair0Gt3apEQkiYdDIhtq5daSFAL64UupWc7CW2JYMFI1jbmsbBJBSNWx9TxP8M8uCDpDZSJOv3DOq36Di+HPFrGJD//s27CmtozFvpoWSgece++0JatUCJzTGVFiL90DWlXz8clbaBhn/EowJHEoAAYF9w6cidrSOeS+fH1JOtSaKhdQmY7t869wcFq2qE2xKWmtWB4IQg2DGPVJIkQ85+ItrgHe2afUMhDEKxVLh/h02RN5i7vjCVw6LmCZcnyx3ri45y0UDZ1FsAGxMI7I9so67TBMyZEktx6lRL+mO0kpRNf/uc2yFnk7jGHxLRkb8eqCX9xZ5/aWjD2Ncir2qXBcpvBr5C3jb76fyykaGbkfXFcJu8BKxhb/nzL3mBoW78MV06tVtq1Z7mh5wcNrnMadIXe+HLpI1erh3IiT/y5s/gCmNgiPlqAlMn+TNQ6Cwp99rDsyZf0Un9L3feU472t3/06EBS2oU71L/8P1qwvJJZqVPZjZ804vNU/rBBxHoEJmWTenwrUWQK+SO0kE2nYHaGvUASmMOChalw+yzDB/+Gnpb4HrUfzh7r+lMv5uUiidmm44+sP0vOnjMDKTiY3QKAe/DK0UWPf+AI5UKRDYiL1KV7lAaWwMaggjfuQAr+TOVHKlJOlvZARcVmiPWlE4eqDL2X0R0wUjc7xPQb/xsnImclcUMk+YunKTp8hw0U8AgKvowmz5xZ8WXMxtbr5iMIhZhookz6MoCUSyxzsxpUsoA7q9F7OqhFVNEkKmqw6iaVkhYcZAk7txYgoHoVYwq3cB4kvB9Sj68bLfoDrdEOFtsdx2aIl146aTNBuS+3E+RhBt5dVXEc0NCzA4HylQ9DAFH4KIDDngJJZn9w1nq8RCRb8Ja0OdX/3up+72Ph3MXL7Wma15yETMuyVaN/CfGldkJa3o1xIwxlovoLnM/ZVfmINdHzPneqG+iVjfSWG4Y+btf7hazvDdW9eL4MIJaQTeR8JG1eOAutHGAyMGotLoy0GXpXQmOjSFcBaux+U9ka8jyLUhdWc392PcECIirSJXsAdEWqK7jul/OU4ycRsGUIX95ok3S7ft4eIVeWhH02LNkBU44rpuPacsEcBOEDYXlC06HN7IaVAlEa+ow5GZDC+4i0+jp9xTZTQQUJNmCrPiFKJCFTNQOFXYE6ZkjnbTjB/ZEyS3JXTIW7rU8NUD1eF3y4uXuuq8L8hJidWhuJ02KwAA11hE6+PFN2gBJO6nqkKWpMliFBuLlvsDv8bi9Vu2bBrARhKg7ZJK6EeRjjW07+EDagRJJbDkdmHphgEcDCGaTultBCUDpUkTcWGtN0gbq1pK34+EHezCFyQeWctoOBbil46o5kDSVLyVbokhN4PHkTP8egV3b3XuPFjqA1zDxEqpD0k+rIdsC/JUJgc0+TWL68XjqmJPqGUphzEqotsr+kJn7Gq1H+IuX+KsGEuW8YhRjqn7EqnZWx328XfyHQuNV7ODqJmh50cUsgFvWppCn0dFJp8Jvv1pdbgD11TbZSJr6tPZzfcMzFRGly0hd12PJ7iWs6sCQ+zQFooutTzT05GYoo4fMA7AOdq9z8UbCeDG8koGxCw/ZgNa3/c0zBtKL27BsApHyx1vNj0sHVo7aGaHhU+v3zepv+ZnZeFlbcR5UXS0G5UCEffqdBe3TLfA8aKr3yDT5UsARCmM2u71pzTYPxvr23BISlPiaaa+9t92fm3o2sp9oDxR8iOFe9KWKDPrpmpAKqyp7lDYc/dVPDNZIKrDaCI8KlZWebZGuoBTm3cX6IIN+m4mvTHJjDYUfMoRH5fNyJPlKkiGQY93ZrmreaIwqz3InvX0yEv0k7TjfTsCFG2dxYpirVc2hM+Fbg2csKj2qQH3TQwB5ZDFTB9okmrroTadYf8Ya1U178Zy7w31Ps/5W1HiEHC57ULqdckHNWx1EiXasO7vtzO7UB4hUpB7Mda+r0F0HZcTiBfgZKIAd4QKcw7uUnrF5h/EUK6l9/RsYOHPMJpfsyTn1XLfq2hCwYVuAWOfseXubem7SkvQDx+KgmKxmoElS8TUTpz5t0zHI2SftPgqAzZEfXRoQ5GYRtH51gei6/YXrFxWKUb3BcRa/dg2rt+Ja3s0qZP8GQx1w4d70XKTzkqZDxpODtUA+bX+550ZJuWOjuSn+UWnjEynfTxYshCmM9lh+jQ3ZbsHxmuykEfoBvdPiz1hHDLPAGcMUwlgTSui8Yma/8UAiJs1s6hZRxFC4DRcLhffq6hBEtMt5Vp9Xwdf1eGfE/dHJ7igtOHQOD6liXVKdx9dleOtEDNRgwq3Dk2tiV2WCYYKKjHHIB7rVV4cjS50uVexBeRmZlyErbdvH7YvmGueUQE573MaeWplSLjTNskLUrepJDBL/TQkPkTkhmFcynbFf3v4P5AErPtCVaiL1DUzVS5DKta7jZUuukc+A0FUwB/NV5IuQRXAuDrrIV4DuwBDUehdo1X7Cfzl+ogN+saG+47e22k95st/HVadeOdVpUdEpiC6v6wfkf+Lk9lknIsIw4dXc+eJzI/mM2HJWALSlCEjaPU/ISJWZOaRF6pNVxKBRgDJEu5qXzyCj+cQT4GAx3kUG8RffD6wpcCAMYVevYItWYGaTceRKEWeH4BIWI8QTHLcAUccWE3a8Nq/M0z+9oM0gbI9hWpO9B5IJewOwUaqFJgecoEm3Y/i5ITyvBPwj7B4yOS/78HbaEOXw/qMJpqMuB3mVl6O4AN6T1a5RHicWnPLTFrP9WpJBooLadgyVb6s/9KX2lgUuZbfbmJ/17yUJ/er8QyKGR8WWBfHavQjo53mH10IQl+GKuF6jsCGh69yeR3pvTGN2JCoSTQOJDGJ0dPfeqLjurdGqtWA6ugaIJfHuWu9gqYdyGG3XhfsHiAcsC21BWFoeaOTdrrMI3N7ykL9VdVhit2HEJUJQLk81Mf2mllaYz3AxySQOfS8C9J1qESyRq6+pQx/LO1LMIEvNZjQtl5eGuF1mYjMl1vzI/GxDdA933GAVO0d8vGvzPPZKdpBp6ZfcU+pEdJ4JtIJ/O5SK556rGJnl4lLC+MsNKmSZlOjSzS9Ra0r0Tmmn8QM+dfzGrR4dUdsk+C8TkS0EV0TtHfP4DkPQ8MkTfrZ8tlRVMjUon8tnhkLzMpSfmyZ6WNvxbiSru9Y6mlV5fOz5Gsmh5vhK7JauMYPC8almmaE1pXhlML7LUoG75nzyxvh7D63Xjp1YiIm/Z9nkHmqqKv+no/zcs6dp/SiGBM1bRtYhoSH0ZxLBqWOwQ9QeUjB6qCFJqHQiBMvpgg0aUvizFyWw4M8uyOHzk9mjWKmiwGbdqEbfuHtCcEWQlZK1u08Sgr+ir9ny3WJ1S3zHC/QQXQ+nG9Yav5Hkj4/6F2Il5oX7nZJa6rFkriO1DFKDQNKYQcKt2ZXLhmZFWB0aQKzX3A8Xp4v9VB0IsTARIBno0AuEL8NWN28T9++5hjEYNpKn+ZegeiXaPQ3WV0sioLGXPD+ESV1fmu/2YY7nhcvGUDXZ+HFlYVbztedxQILQsTSAHRObvg4EfMm3Mn1iePZFr42g6lw9UtXGC0Yx5NDBsy9AzbJqGG8hHY6EDKN8x1lzQ8dq1qpgjhqcos8Sopf99CraQoGPpSsi9/dER9eTvrtLplNAT9xsfz//gbw+8dgTcivGKTjgtWrP2BMwLuy/j8zai3t9MknaIaLFj5D5JF7lOp2GExdGNw+bZF1ZJz9kAzFOJGsP0tP+tGPV5s7jh2jS6K/JfwWVT0uEWJApD+Fvpf7M4CC9pnlVUYCGdhSK7C5QpzbLkU43Z+pxBL9fvDrXF04AUQiHgW89Ho9WwLCamrMgptM+hSZttaS72Oh7zDZTUj7b0t0UqqWVVJt18ExMqtfaFjAadw7gOB+jB/GdCXLzxaZan5LjJtQPlW+Sx+CkytdU4bhd1qM+x5Dy+dCriS0E0kBU+e9+EATPYzUhvLEpsCFEe/nbNCareuqKdVaUAyVgs12SqNvXM6d2SF5IgB0e/x3tpMdERYvqKxkGh9jlgUC3Myv897rIhIJIgXePwIljY3+Js2U3BpRaV1FSlYl+c7ciyLbx//tBDW97TLbvmTBqsQLjn/P9F/WIFIl4zo4S9u200GLDFssq2IzFEBA3E/oSI2LQFRmLwK6BUkT9uw8QGE99839QfaKfehIoOnw2PbBg/qmZjVKzgNs3+KeUA5aEwvwEOZlZcRuph6UWz2zN6fDsGjGfk7cvdXVAIk36ezIaUi5kA4eDRyKwuWfoivhv53W/mTN9QhssYwzuV4vW6tKzU9BLAkv+N92PJlJVQSI4ZpAGF39Kzm66tbQv57FqjZIy6HJY+OHEYOm+pEhOwGjIr1rwBQqoVksSXWSS9yL6jHBZCsQiNgz4jtCF2ex3zCgVjkb/f1bgAAA=', '2026-03-16 00:26:53.830457');
INSERT INTO public.complaint_images VALUES (10, 13, 'data:image/jpeg;base64,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', '2026-04-21 17:03:33.186429');


--
-- Data for Name: complaints; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.complaints VALUES (12, 27, 38, 8, 'Kitchen sink issue', 'please the sink is leaking in the kitchen , fix it as soon as possible', 'OPEN', '2026-03-16 00:26:53.815168', '2026-03-16 00:26:53.815168', 'Plumbing', 'High');
INSERT INTO public.complaints VALUES (13, 30, 38, 12, 'Geyser not working', 'geyser is not wroking well', 'Resolved', '2026-04-21 17:03:33.149441', '2026-04-21 17:38:37.161222', 'Appliance', 'Medium');


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.messages VALUES (3, 24, 23, NULL, 'Tintunaa ra', true, '2026-03-13 19:24:14.813776');
INSERT INTO public.messages VALUES (4, 24, 23, NULL, 'Nuvu', true, '2026-03-13 19:24:20.816368');
INSERT INTO public.messages VALUES (5, 23, 24, NULL, 'ha sare anna', true, '2026-03-13 20:27:05.292505');
INSERT INTO public.messages VALUES (6, 24, 23, NULL, 'ok', true, '2026-03-13 20:59:56.555234');
INSERT INTO public.messages VALUES (7, 23, 24, NULL, 'Haaa', true, '2026-03-13 21:00:33.923209');
INSERT INTO public.messages VALUES (8, 23, 24, NULL, 'hi anna ', false, '2026-03-14 17:53:24.664445');
INSERT INTO public.messages VALUES (9, 23, 24, NULL, 'good evening', false, '2026-03-14 17:53:31.620563');
INSERT INTO public.messages VALUES (1, 23, 24, NULL, 'hi anna', true, '2026-02-10 22:47:18.99886');
INSERT INTO public.messages VALUES (2, 23, 24, NULL, 'em chestunav', true, '2026-02-10 22:47:30.886247');
INSERT INTO public.messages VALUES (10, 38, 33, NULL, 'hello babu pay deposit money', true, '2026-03-15 01:16:14.080668');
INSERT INTO public.messages VALUES (11, 38, 33, NULL, '🙌🙌', true, '2026-03-15 01:16:26.370532');
INSERT INTO public.messages VALUES (12, 33, 38, NULL, 'ok anna', true, '2026-03-15 01:47:38.626065');
INSERT INTO public.messages VALUES (13, 49, 38, NULL, 'Hello thammudu', true, '2026-03-16 00:27:39.053602');
INSERT INTO public.messages VALUES (14, 38, 49, NULL, 'hi anna', true, '2026-03-16 23:05:53.887586');
INSERT INTO public.messages VALUES (15, 49, 38, NULL, 'hi', true, '2026-03-18 12:42:04.516425');
INSERT INTO public.messages VALUES (16, 38, 52, 12, 'hi broooo', true, '2026-04-17 02:32:40.674596');
INSERT INTO public.messages VALUES (17, 52, 38, 12, 'hi anna', true, '2026-04-17 11:39:20.370294');
INSERT INTO public.messages VALUES (18, 38, 49, 8, 'hi', true, '2026-04-23 14:24:09.307551');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.notifications VALUES (24, 38, 'booking', '📅 New Booking Request', 'Bruce has requested to visit Boys PG.', false, '2026-03-31 02:08:52.598107');
INSERT INTO public.notifications VALUES (25, 38, 'booking', '📅 New Booking Request', 'Bruce has requested to visit Modern 2BHK House – Guntur Residential Area.', false, '2026-03-31 02:19:26.113737');
INSERT INTO public.notifications VALUES (1, 24, 'complaint', 'New Complaint: Door strucked', 'Sairam Muttukuru raised a complaint regarding Door strucked at Spacious 3BHK Apartment with City View. Priority: Critical.', true, '2026-01-28 15:28:07.671896');
INSERT INTO public.notifications VALUES (3, 24, 'payment', 'Security Deposit Received', 'Security Deposit of ₹30000.00 received from Sairam Muttukuru.', true, '2026-02-11 15:41:24.000503');
INSERT INTO public.notifications VALUES (4, 24, 'payment', 'Security Deposit Received', 'Security Deposit of ₹6000.00 received from Bhavani Muttukuru.', true, '2026-02-19 01:30:13.893307');
INSERT INTO public.notifications VALUES (5, 24, 'payment', 'Rent Received', 'Rent Received of ₹25000 received from Sairam Muttukuru for Spacious 3BHK Apartment with City View.', true, '2026-03-14 14:47:56.389662');
INSERT INTO public.notifications VALUES (6, 24, 'payment', 'Rent Received', 'Rent Received of ₹25000 received from Sairam Muttukuru for Spacious 3BHK Apartment with City View.', true, '2026-03-14 14:52:21.820667');
INSERT INTO public.notifications VALUES (7, 24, 'payment', 'Rent Received', 'Rent Received of ₹25000.00 received from Sairam Muttukuru for Spacious 3BHK Apartment with City View.', true, '2026-03-14 16:59:14.208592');
INSERT INTO public.notifications VALUES (8, 24, 'payment', 'Rent Received', 'Rent Received of ₹50000.00 received from Sairam Muttukuru for Spacious 3BHK Apartment with City View.', true, '2026-03-14 17:49:25.414382');
INSERT INTO public.notifications VALUES (9, 24, 'payment', 'Rent Received', 'Rent Received of ₹125000.00 received from Sairam Muttukuru for Spacious 3BHK Apartment with City View.', true, '2026-03-14 18:24:44.835218');
INSERT INTO public.notifications VALUES (10, 24, 'payment', 'Rent Received', 'Rent Received of ₹50920.00 received from Sairam Muttukuru for Spacious 3BHK Apartment with City View.', true, '2026-03-14 19:42:18.43481');
INSERT INTO public.notifications VALUES (11, 24, 'payment', 'Rent Received', 'Rent Received of ₹21000.00 received from Bhavani Muttukuru for Lakshmi Ladies PG – MVP Colony.', false, '2026-03-14 19:45:20.808291');
INSERT INTO public.notifications VALUES (12, 24, 'payment', 'Rent Received', 'Rent Received of ₹6000.00 received from Sairam Muttukuru for Sairam Boys PG & Hostel.', false, '2026-03-14 21:13:39.838455');
INSERT INTO public.notifications VALUES (26, 38, 'booking', '📅 New Booking Request', 'Bruce has requested to visit Furnished IT Office Space – Benz Circle.', false, '2026-03-31 02:23:33.268032');
INSERT INTO public.notifications VALUES (27, 38, 'booking', '📅 New Booking Request', 'Ramjaaly has requested to visit Sri Lakshmi Residency.', false, '2026-04-16 19:58:11.984093');
INSERT INTO public.notifications VALUES (13, 38, 'payment', 'Rent Received', 'Rent Received of ₹8998.00 received from Megumi Fushiguro for Working Men’s PG – Brodipet, Guntur.', true, '2026-03-14 23:54:59.498274');
INSERT INTO public.notifications VALUES (14, 38, 'payment', 'Rent Received', 'Rent Received of ₹4499.00 received from Megumi Fushiguro for Working Men’s PG – Brodipet, Guntur.', true, '2026-03-15 01:48:58.905');
INSERT INTO public.notifications VALUES (15, 38, 'payment', 'Rent Received', 'Rent Received of ₹6000.00 received from Manikanta Uzumaki for Sairam Boys PG & Hostel.', true, '2026-03-15 21:44:26.713573');
INSERT INTO public.notifications VALUES (16, 38, 'payment', 'Security Deposit Received', 'Security Deposit Received of ₹5000.00 received from Manikanta Uzumaki for Sairam Boys PG & Hostel.', true, '2026-03-15 21:45:25.493182');
INSERT INTO public.notifications VALUES (17, 38, 'complaint', 'New Complaint: Kitchen sink problem', 'Manikanta Uzumaki raised a complaint regarding Kitchen sink problem at Sairam Boys PG & Hostel. Priority: Critical.', true, '2026-03-16 00:00:14.343113');
INSERT INTO public.notifications VALUES (18, 38, 'complaint', 'New Complaint: Kitchen sink', 'Manikanta Uzumaki raised a complaint regarding Kitchen sink at Sairam Boys PG & Hostel. Priority: High.', true, '2026-03-16 00:13:34.011785');
INSERT INTO public.notifications VALUES (19, 38, 'complaint', 'New Complaint: water problem', 'Manikanta Uzumaki raised a complaint regarding water problem at Sairam Boys PG & Hostel. Priority: High.', true, '2026-03-16 00:15:39.383751');
INSERT INTO public.notifications VALUES (20, 38, 'complaint', 'New Complaint: wewccewrcec', 'Manikanta Uzumaki raised a complaint regarding wewccewrcec at Sairam Boys PG & Hostel. Priority: Medium.', false, '2026-03-16 00:22:27.971596');
INSERT INTO public.notifications VALUES (21, 38, 'complaint', 'New Complaint: kewjdnkewjdkewj', 'Manikanta Uzumaki raised a complaint regarding kewjdnkewjdkewj at Sairam Boys PG & Hostel. Priority: Low.', false, '2026-03-16 00:24:53.300414');
INSERT INTO public.notifications VALUES (22, 38, 'complaint', 'New Complaint: Kitchen sink issue', 'Manikanta Uzumaki raised a complaint regarding Kitchen sink issue at Sairam Boys PG & Hostel. Priority: High.', false, '2026-03-16 00:26:53.836245');
INSERT INTO public.notifications VALUES (23, 38, 'booking', '📅 New Booking Request', 'Bruce has requested to visit Ground Floor Commercial Shop – Eluru Road.', false, '2026-03-31 00:40:08.372194');
INSERT INTO public.notifications VALUES (28, 38, 'payment', 'Rent Received', 'Rent Received of ₹4499.00 received from Ramjaaly Jaswanth Raj for Working Men’s PG – Brodipet, Guntur.', false, '2026-04-17 12:17:46.929391');
INSERT INTO public.notifications VALUES (29, 31, 'booking_cancelled', '🚫 Service Cancelled', 'The request for Accessory Installation has been cancelled by the user. Reason: problem is resolved ', true, '2026-04-17 22:01:26.373018');
INSERT INTO public.notifications VALUES (30, 38, 'complaint', 'New Complaint: Geyser not working', 'Ramjaaly Jaswanth Raj raised a complaint regarding Geyser not working at Working Men’s PG – Brodipet, Guntur. Priority: Medium.', false, '2026-04-21 17:03:33.270712');
INSERT INTO public.notifications VALUES (31, 31, 'booking', 'New Service Request', 'You have a new booking request for Geyser Check-Up.', false, '2026-04-21 17:07:32.624073');
INSERT INTO public.notifications VALUES (32, 31, 'booking', 'New Service Request', 'You have a new booking request for Door Installation.', false, '2026-04-22 14:24:26.291012');
INSERT INTO public.notifications VALUES (33, 31, 'booking', 'New Service Request', 'You have a new booking request for Lock Installation / Replacement.', false, '2026-04-22 14:29:27.228508');


--
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.properties VALUES (12, 38, 'Working Men’s PG – Brodipet, Guntur', 'This working men’s PG in Brodipet, Guntur offers affordable accommodation with basic amenities. The rooms are well-ventilated and equipped with storage facilities. The property includes common washing areas and 24/7 water supply. It is located near commercial areas, making it convenient for employees.', 'PG', 4499.00, 'South', -2, 2, 0, 'Nellore', 'kisannagar', 'kisannagar, Nellore', 0.0, false, '2026-02-16 18:16:39.889392', '2026-04-17 02:03:07.612399', NULL, NULL, NULL, NULL, false, NULL, false, NULL, NULL, NULL, false, false, 0, 'Triple Sharing', NULL, true, 'Male Only', false, NULL, false, false, NULL, NULL, false, NULL, 'Available', NULL, 0.00, '', NULL, NULL, '7013527597sai@ybl', 0.00, 5, 'No illegal activities.

Monthly rent in advance.

Respect fellow residents.

Keep common areas clean.', NULL, NULL, false, '', 3, '301');
INSERT INTO public.properties VALUES (7, 38, 'Boys PG', 'This well-maintained boys PG is located near SRM College, Vijayawada. The property offers spacious shared rooms with proper ventilation, attached bathrooms, and regular housekeeping services. The building is secured with CCTV surveillance and provides uninterrupted water supply. It is ideal for students and working professionals looking for affordable and safe accommodation.', 'PG', 6500.00, 'East', 0, 0, 0, 'Vijayawada', 'Benz Circle', 'Near SRM College, Vijayawada', 0.0, false, '2026-02-16 14:39:50.600281', NULL, NULL, NULL, NULL, NULL, false, NULL, false, NULL, NULL, NULL, false, false, 0, 'Double Sharing', NULL, true, 'Male Only', true, NULL, false, false, NULL, NULL, false, NULL, 'Available', NULL, 0.00, NULL, NULL, NULL, NULL, 0.00, 5, 'Strict in-time before 10 PM.
No smoking or drinking.
Visitors not allowed inside rooms.
Valid ID proof mandatory.', 16.4984418, 80.6526978, false, NULL, 1, NULL);
INSERT INTO public.properties VALUES (11, 38, 'Furnished IT Office Space – Benz Circle', 'This fully furnished office space is located in the commercial hub of Benz Circle, Vijayawada. The office includes workstations, manager cabins, and a dedicated conference room. The building has lift access, security, and uninterrupted power backup. Ideal for startups, IT companies, and consulting firms.', 'OFFICE_SPACE', 45000.00, 'North', 0, 0, 0, 'Vijayawada', 'Benz Circle', 'Benz Circle, Vijayawada', 0.0, false, '2026-02-16 18:06:10.593563', '2026-02-16 18:23:48.693839', NULL, NULL, 3, NULL, false, NULL, false, NULL, NULL, NULL, false, false, 0, NULL, NULL, false, NULL, false, NULL, false, true, 'it', 30, true, NULL, 'Available', NULL, 150000.00, '5% annual increase', '', '', '', 0.00, 18, 'Commercial registration required.

No structural modifications.

Electricity charges separate.

Maintenance charges applicable.', 16.4984418, 80.6526978, false, NULL, 1, NULL);
INSERT INTO public.properties VALUES (10, 38, 'Ground Floor Commercial Shop – Eluru Road', 'This commercial shop is located on the main Eluru Road in Vijayawada, offering excellent visibility and high foot traffic. The shop is ideal for retail stores, mobile shops, or small offices. It features a wide entrance, good ventilation, and a proper water connection. The location is surrounded by residential colonies and commercial establishments, making it suitable for steady business operations.', 'COMMERCIAL_SHOP', 21999.00, 'East', 0, 0, 0, 'Vijayawada', 'Eluru Road', 'Eluru Road, Vijayawada', 0.0, false, '2026-02-16 17:43:34.993635', '2026-02-18 23:44:29.877956', NULL, NULL, NULL, NULL, false, NULL, false, NULL, NULL, NULL, false, false, 0, NULL, NULL, false, NULL, false, 'retail', true, false, NULL, NULL, false, NULL, 'Available', NULL, 60000.00, '5% annual increase', '234567890123', 'HDFC0001234', 'lakshmipg@upi', 0.00, 5, 'No illegal activities.

Commercial license required.

Monthly rent to be paid before 5th.

Electricity charges separate.', 16.5238862, 80.6550537, false, NULL, 1, NULL);
INSERT INTO public.properties VALUES (6, 38, 'Modern 2BHK House – Guntur Residential Area', 'This modern 2BHK house in Guntur is located in a well-developed colony with good road access and nearby grocery stores. The house offers spacious bedrooms, a bright living hall, and a neatly designed kitchen. The property has proper water supply and secure surroundings, making it ideal for small families.', 'INDEPENDENT', 20000.00, 'East', 2, 2, 1900, 'Hyderabad ', 'Ameerpet', 'Near apolo hospital , opposite to Ramalayam temple', 0.0, false, '2026-02-16 14:10:42.867103', '2026-02-16 14:18:09.268045', NULL, NULL, NULL, 2, false, NULL, false, 'CAR_BIKE', 'GROUND_ONLY', NULL, false, false, 0, NULL, NULL, false, NULL, false, NULL, false, false, NULL, NULL, false, NULL, 'Available', NULL, 30000.00, '2', '123456789012', 'SBIN0001234', 'muttukuru@upi', 0.00, 18, 'Family tenants only.

No pets allowed.

Maintain cleanliness in common areas.

Electricity bill separate.', 17.4375012, 78.4482505, false, NULL, 1, NULL);
INSERT INTO public.properties VALUES (8, 38, 'Sairam Boys PG & Hostel', 'Sairam Boys PG is a well-maintained hostel located in Benz Circle, Vijayawada. The property offers clean and spacious shared rooms with proper ventilation and attached bathrooms. It is situated in a peaceful residential area with easy access to colleges, bus stops, and supermarkets. Daily housekeeping and uninterrupted water supply are available, making it ideal for students and working professionals.', 'PG', 6000.00, 'East', 0, 1, 0, 'Vijayawada', 'Benz Circle', 'Benz Circle, Vijayawada', 0.0, false, '2026-02-16 17:31:02.989998', '2026-04-14 13:43:49.783599', NULL, NULL, NULL, NULL, false, NULL, false, NULL, NULL, NULL, false, false, 0, 'Double Sharing', NULL, true, 'Male Only', true, NULL, false, false, NULL, NULL, false, NULL, 'Available', NULL, 5000.00, '5% annual increase', '123456789012', 'SBIN0000456', 'srisai.pg@upi', 0.00, 20, 'Strict in-time before 10 PM.

No smoking or alcohol consumption.

Visitors not allowed inside rooms.

Rent must be paid before due date.

Maintain cleanliness of rooms.', 16.4984418, 80.6526978, false, '', 2, NULL);
INSERT INTO public.properties VALUES (5, 38, 'Commercial Shop on Main Road', 'Spacious commercial shop located on a high-footfall main road. Ideal for retail business, showroom, or branded outlet. Excellent visibility and easy access.', 'COMMERCIAL_SHOP', 20000.00, 'West', 0, 0, 0, 'Hyderabad', 'Ameerpet', 'Shop No. 3, Ground Floor, Sai Plaza, Near Ameerpet Metro Station, Hyderabad, Telangana – 500016', 0.0, false, '2026-01-28 12:52:11.231041', NULL, NULL, NULL, 1, NULL, false, NULL, false, NULL, NULL, NULL, false, false, 0, NULL, NULL, false, NULL, false, 'retail', false, false, NULL, NULL, false, NULL, 'Available', NULL, 0.00, NULL, NULL, NULL, NULL, 0.00, 5, NULL, 17.4375012, 78.4482505, true, NULL, 1, NULL);
INSERT INTO public.properties VALUES (25, 38, 'Sri Lakshmi Residency', 'A well-maintained residential apartment located in a peaceful neighborhood with easy access to main roads, schools, and supermarkets. Suitable for families and working professionals.', 'APARTMENT', 15000.00, 'East', 2, 2, 999, 'Hyderabad', 'Myiapur', 'Myiapur, Hyderabad', 0.0, false, '2026-04-05 18:32:52.841726', '2026-04-05 18:39:52.208689', 'Sri Lakshmi Residency', '302', 3, 2, false, 5, false, 'CAR_OPEN', NULL, NULL, false, false, 0, NULL, NULL, false, NULL, false, NULL, false, false, NULL, NULL, false, NULL, 'Available', NULL, 30000.00, '5% annual increase', NULL, NULL, 'lakshmi@upi', 20.00, 10, 'No pets allowed
Maintain cleanliness in common areas
No loud noise after 10 PM
Only family tenants preferred', NULL, NULL, false, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1775393639/b343nlr9bpablw7tmivr.svg', 1, NULL);


--
-- Data for Name: property_amenities; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.property_amenities VALUES (5, 3);
INSERT INTO public.property_amenities VALUES (5, 7);
INSERT INTO public.property_amenities VALUES (6, 3);
INSERT INTO public.property_amenities VALUES (6, 6);
INSERT INTO public.property_amenities VALUES (6, 7);
INSERT INTO public.property_amenities VALUES (7, 5);
INSERT INTO public.property_amenities VALUES (7, 4);
INSERT INTO public.property_amenities VALUES (7, 7);
INSERT INTO public.property_amenities VALUES (7, 8);
INSERT INTO public.property_amenities VALUES (11, 3);
INSERT INTO public.property_amenities VALUES (11, 4);
INSERT INTO public.property_amenities VALUES (11, 5);
INSERT INTO public.property_amenities VALUES (11, 7);
INSERT INTO public.property_amenities VALUES (11, 8);
INSERT INTO public.property_amenities VALUES (10, 7);
INSERT INTO public.property_amenities VALUES (25, 3);
INSERT INTO public.property_amenities VALUES (25, 7);
INSERT INTO public.property_amenities VALUES (25, 8);
INSERT INTO public.property_amenities VALUES (8, 5);
INSERT INTO public.property_amenities VALUES (8, 7);
INSERT INTO public.property_amenities VALUES (12, 4);
INSERT INTO public.property_amenities VALUES (12, 5);


--
-- Data for Name: property_images; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.property_images VALUES (5, 5, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1769584924/yw1b7kkgjsajaerdycyw.jpg', true);
INSERT INTO public.property_images VALUES (6, 5, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1769584927/wofobbcyt9ias3hcstjx.jpg', false);
INSERT INTO public.property_images VALUES (20, 6, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771230789/odrmkrfftklipxfbvw9r.jpg', true);
INSERT INTO public.property_images VALUES (21, 6, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771230841/bbb5q1epfeyducjb2bic.jpg', false);
INSERT INTO public.property_images VALUES (22, 6, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771230874/tmo81njo8pqu4pyxlgyh.jpg', false);
INSERT INTO public.property_images VALUES (23, 7, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771232341/gjxoimeibq7ytjb0ddbl.avif', true);
INSERT INTO public.property_images VALUES (24, 7, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771232354/ptdzqvuwxo9zux5rvrqt.avif', false);
INSERT INTO public.property_images VALUES (25, 7, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771232361/p1slvnbpfjkddsxr1xge.avif', false);
INSERT INTO public.property_images VALUES (39, 11, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771245312/uwseta4rrxlzgnvm74ya.jpg', true);
INSERT INTO public.property_images VALUES (40, 11, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771245318/ob8li7hha6rpt9g09xxk.webp', false);
INSERT INTO public.property_images VALUES (41, 11, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771245334/tgxfuq8pgrcrobm0bipb.png', false);
INSERT INTO public.property_images VALUES (42, 11, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771245338/npzzbuokh1gtvz07qzja.png', false);
INSERT INTO public.property_images VALUES (43, 10, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771243996/fkpmvwxbvnno1ehacsm0.avif', true);
INSERT INTO public.property_images VALUES (44, 10, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771244002/b4bpxibguhil4nkgvehp.jpg', false);
INSERT INTO public.property_images VALUES (51, 25, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1775394141/nl5mouqpbvcpnbxckzms.jpg', true);
INSERT INTO public.property_images VALUES (52, 25, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1775394150/hkhitsynj8tilp0cuc9k.jpg', false);
INSERT INTO public.property_images VALUES (53, 25, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1775394565/ze6umkkp415x06zojvcd.webp', false);
INSERT INTO public.property_images VALUES (56, 8, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771243233/wfsi2n1txrlflxarpssl.webp', true);
INSERT INTO public.property_images VALUES (57, 8, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771243240/gco8l4at3xdbkzlizoed.jpg', false);
INSERT INTO public.property_images VALUES (58, 8, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771243248/bjf5mq4mjfmgg7ucwn0p.webp', false);
INSERT INTO public.property_images VALUES (61, 12, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771245948/xmsshcklbxzyydwczl3l.avif', true);
INSERT INTO public.property_images VALUES (62, 12, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771245987/smxvwy39evidorlcs68g.avif', false);


--
-- Data for Name: provider_earnings; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: provider_services; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.provider_services VALUES (19, 9, 39, 1000, true, '2026-03-20 19:25:10.342221');
INSERT INTO public.provider_services VALUES (26, 9, 41, 300, true, '2026-04-12 14:45:16.00944');
INSERT INTO public.provider_services VALUES (27, 9, 40, 400, true, '2026-04-12 14:45:18.310106');
INSERT INTO public.provider_services VALUES (28, 9, 48, 150, true, '2026-04-12 14:52:53.254129');
INSERT INTO public.provider_services VALUES (29, 9, 49, 100, true, '2026-04-20 13:55:55.201569');
INSERT INTO public.provider_services VALUES (30, 9, 50, 300, true, '2026-04-20 14:32:30.729228');
INSERT INTO public.provider_services VALUES (31, 9, 51, 280, true, '2026-04-20 14:39:08.630765');
INSERT INTO public.provider_services VALUES (32, 9, 52, 500, true, '2026-04-20 14:45:09.845184');
INSERT INTO public.provider_services VALUES (33, 9, 53, 240, true, '2026-04-21 11:37:04.984979');
INSERT INTO public.provider_services VALUES (23, 9, 47, 150, true, '2026-04-12 14:39:25.780689');
INSERT INTO public.provider_services VALUES (21, 9, 45, 170, true, '2026-04-12 13:48:25.670589');
INSERT INTO public.provider_services VALUES (22, 9, 46, 200, true, '2026-04-12 14:13:04.977565');


--
-- Data for Name: rent_payments; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.rent_payments VALUES (36, 12, 12, 4499.00, '2026-03-14', '2026-01-19', 'PAID', '2026-03-15 01:23:06.54293', 'Stripe', 'RENT-1773512693936-JAN', 'RENT-1773512693936-FEB', 'Megumi Fushiguro', NULL, 'STANDARD', NULL);
INSERT INTO public.rent_payments VALUES (37, 12, 12, 4499.00, '2026-03-14', '2026-02-19', 'PAID', '2026-03-15 01:48:52.972817', 'Stripe', 'MOCK_TX_1773519532886', 'RENT-1773519532955', 'Megumi Fushiguro', NULL, 'STANDARD', NULL);
INSERT INTO public.rent_payments VALUES (38, 27, 8, 6000.00, '2026-03-15', '2026-03-15', 'PAID', '2026-03-15 21:44:17.79677', 'Stripe', 'MOCK_TX_1773591257680', 'RENT-1773591257768', 'Manikanta Uzumaki', NULL, 'STANDARD', NULL);
INSERT INTO public.rent_payments VALUES (39, 27, 8, 5000.00, '2026-03-15', '2026-03-15', 'PAID', '2026-03-15 21:45:17.642757', 'Stripe', 'MOCK_TX_1773591317516', 'SEC-DEP-1773591317637', 'Manikanta Uzumaki', NULL, 'STANDARD', NULL);
INSERT INTO public.rent_payments VALUES (40, 30, 12, 4499.00, '2026-04-17', '2026-04-17', 'PAID', '2026-04-17 12:17:46.244644', 'Stripe', 'MOCK_TX_1776408466215', 'RENT-1776408466227', 'Ramjaaly Jaswanth Raj', NULL, 'STANDARD', NULL);


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: service_categories; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_categories VALUES (13, 'Plumbing', 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&q=80&w=800', NULL, NULL, 'Expert plumbing services for repairs and installations.', NULL);
INSERT INTO public.service_categories VALUES (14, 'Electrical', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800', NULL, NULL, 'Professional electrical repairs and wiring.', NULL);
INSERT INTO public.service_categories VALUES (16, 'Painting', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&q=80&w=800', NULL, NULL, 'Interior and exterior home painting.', NULL);
INSERT INTO public.service_categories VALUES (15, 'Carpentry', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop', NULL, NULL, 'Custom furniture and wood repairs.', NULL);
INSERT INTO public.service_categories VALUES (7, 'Ac and Appliance repair', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1770121198/dlgxawmtvvqen6u9c1cl.jpg', NULL, NULL, 'Any kind of appliance', NULL);
INSERT INTO public.service_categories VALUES (8, 'Home Cleaning', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1770211362/zlajgljdmta7hmkrfpqg.jpg', NULL, NULL, '', NULL);


--
-- Data for Name: service_providers; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_providers VALUES (9, 31, 'Abhinav services', 'All in one', 'Nellore', '9898345678', 'Active', '2026-02-05 13:16:01.942806', NULL, NULL, NULL, NULL);
INSERT INTO public.service_providers VALUES (10, 32, 'ajay services', 'Plumbing', 'Nellore', '2121891900', 'Active', '2026-02-05 21:03:16.747512', NULL, NULL, NULL, NULL);
INSERT INTO public.service_providers VALUES (7, 29, 'Sairam home services', 'Plumbing', 'Nellore', '9876543210', 'Active', '2026-01-28 21:02:02.430676', NULL, NULL, NULL, NULL);
INSERT INTO public.service_providers VALUES (11, 34, 'Zenin home services', 'Electrical', 'Hyderabad', '2121891900', 'Active', '2026-02-15 22:35:58.288983', NULL, NULL, NULL, NULL);
INSERT INTO public.service_providers VALUES (12, 35, 'Zenin home services', 'Electrical', 'Hyderabad', '8899889988', 'Active', '2026-02-15 22:37:53.576055', NULL, NULL, NULL, NULL);
INSERT INTO public.service_providers VALUES (13, 37, 'Waseem home services', 'Plumbing', 'Hyderabad', '8899889988', 'Active', '2026-02-15 22:53:39.437281', NULL, NULL, NULL, NULL);
INSERT INTO public.service_providers VALUES (8, 30, 'Uzumaki home services', 'Carpentry', 'Vijayawada', '9876543210', 'Active', '2026-02-02 10:26:10.167416', 3, 'hbdhebdhkebdhqewiohdnqowindxlnwqdlenhoqnwondxlend', '9876543210', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1770191608/gwspq6xkyrb78ij4csbk.jpg');


--
-- Data for Name: service_requests; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_requests VALUES (32, NULL, 12, 12, 38, 'AC Installation', 'Normal', 'Accepted', 9, '2026-03-29 22:22:33.612481', NULL, 'megumi123sai@gmail.com', 44, '2026-03-31', '17:30:00', 999.00, 33, 'nlr', 'COD', '2026-03-31', '05:30 PM', '2026-03-29 22:22:58.747111', NULL, NULL, NULL, '07013527597', NULL, '[{"name": "Manoj Kumar", "phone": "8912001122"}]', 'PENDING', NULL);
INSERT INTO public.service_requests VALUES (34, NULL, NULL, NULL, NULL, 'Geyser Check-Up', 'Medium', 'Completed', 9, '2026-04-21 17:07:32.558641', NULL, 'sairammuttukuru5@gmail.com', 53, '2026-04-28', '18:00:00', 240.00, 38, 'Working Men’s PG – Brodipet, Guntur, kisannagar, Nellore, kisannagar, Nellore', 'Online', '2026-04-28', '18:00', '2026-04-21 17:27:01.375012', NULL, NULL, NULL, '7013527597', NULL, '[{"name": "Chandu ", "phone": "8712311292"}]', 'PAID', 'SVC-1776777114365');
INSERT INTO public.service_requests VALUES (35, NULL, 30, 12, 38, 'Door Installation', 'Normal', 'Completed', 9, '2026-04-22 14:24:26.225958', NULL, '22711a05b3@necn.ac.in', 39, '2026-04-22', '20:00:00', 1000.00, 52, 'kisannagar, Nellore', 'COD', '2026-04-22', '20:00', '2026-04-22 14:26:27.193453', NULL, NULL, NULL, NULL, NULL, '[]', 'PENDING', NULL);
INSERT INTO public.service_requests VALUES (36, NULL, 30, 12, 38, 'Lock Installation / Replacement', 'Normal', 'Completed', 9, '2026-04-22 14:29:27.201824', NULL, '22711a05b3@necn.ac.in', 41, '2026-04-22', '18:00:00', 300.00, 52, 'kisannagar, Nellore', 'Online', '2026-04-22', '18:00', '2026-04-22 14:32:09.714927', NULL, NULL, NULL, NULL, NULL, '[{"name": "Sairam", "phone": "8912638100"}]', 'PAID', 'SVC-1776848592565');
INSERT INTO public.service_requests VALUES (33, NULL, 30, 12, 38, 'Accessory Installation', 'Normal', 'Cancelled', 9, '2026-04-17 19:45:57.444283', NULL, '22711a05b3@necn.ac.in', 47, '2026-04-24', '15:00:00', 100.00, 52, 'kisannagar, Nellore', 'Cash', '2026-04-24', '15:00', '2026-04-17 22:01:26.354165', NULL, NULL, NULL, NULL, 'problem is resolved ', '[]', 'PENDING', NULL);


--
-- Data for Name: service_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_reviews VALUES (1, 7, 24, 5, 'Great service! ', '2026-02-05 18:11:46.374898');


--
-- Data for Name: service_slots; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_slots VALUES (1, 32, 9, '2026-04-04', '10:00:00', '12:00:00', 'CONFIRMED', '2026-04-01 12:08:11.133564', '2026-04-21 17:14:48.780322');
INSERT INTO public.service_slots VALUES (2, 32, 9, '2026-04-28', '18:00:00', '19:00:00', 'CONFIRMED', '2026-04-12 18:05:22.050352', '2026-04-21 17:25:48.443834');
INSERT INTO public.service_slots VALUES (3, 34, 9, '2026-04-21', '17:30:00', '18:00:00', 'CONFIRMED', '2026-04-21 17:26:27.681649', '2026-04-21 17:26:27.681649');
INSERT INTO public.service_slots VALUES (4, 36, 9, '2026-04-22', '18:00:00', '19:00:00', 'CONFIRMED', '2026-04-22 14:31:12.84057', '2026-04-22 14:31:12.84057');


--
-- Data for Name: service_sub_types; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_sub_types VALUES (2, 8, 'Ac Installation / Uninstallation', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771054232/nefnypk5y6ilhiin5fui.jpg', NULL, '2026-02-14 13:00:30.945214');
INSERT INTO public.service_sub_types VALUES (3, 8, 'AC Maintenance Services', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771054423/ory5muxettsd4crhkmhl.jpg', NULL, '2026-02-14 13:03:43.09972');
INSERT INTO public.service_sub_types VALUES (4, 8, 'Ac Repair', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771054824/ek9q9oa8wcm9z10nul2g.jpg', NULL, '2026-02-14 13:10:23.00945');
INSERT INTO public.service_sub_types VALUES (1, 10, 'Geyser', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771058786/stksnsljvqet1bwfewq8.jpg', NULL, '2026-02-13 17:17:46.11456');
INSERT INTO public.service_sub_types VALUES (5, 10, 'Washing Machine', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771059372/vo25mbxvr6witb6jljec.jpg', NULL, '2026-02-14 14:26:10.538089');
INSERT INTO public.service_sub_types VALUES (6, 10, 'Water Purifier', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771059482/pw5si9vhomckgzaaiky1.jpg', NULL, '2026-02-14 14:27:38.960103');
INSERT INTO public.service_sub_types VALUES (7, 10, 'Refrigerator', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771059549/n5yuajisejionjgiijno.jpg', NULL, '2026-02-14 14:29:08.4232');
INSERT INTO public.service_sub_types VALUES (8, 10, 'DishWasher', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771059890/cb6o2hwieexfck61b4ip.jpg', NULL, '2026-02-14 14:34:29.477306');
INSERT INTO public.service_sub_types VALUES (9, 10, 'MicroWave', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771060042/dgbdzst7xtk0fnbjgmbb.jpg', NULL, '2026-02-14 14:37:20.75123');


--
-- Data for Name: service_types; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.service_types VALUES (8, 7, 'Ac repair', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1770121236/m9rfzytxcjtazsdm2wwm.jpg', 'Installation of Ac and uninstallation of Ac');
INSERT INTO public.service_types VALUES (11, 8, 'Full House Cleaning', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771060200/v1jxeoxs60v7c4bruawt.jpg', '');
INSERT INTO public.service_types VALUES (12, 8, 'Kitchen Cleaning', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771060335/crgpmcduu91cxnffcgsn.jpg', '');
INSERT INTO public.service_types VALUES (13, 8, 'Sofa Cleaning', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771061641/o1kiah6ipeopug25tids.jpg', '');
INSERT INTO public.service_types VALUES (14, 8, 'Bathroom Cleaning', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771061856/c5hpm0ykose46nnphmt9.jpg', '');
INSERT INTO public.service_types VALUES (15, 14, 'Fan', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066030/kxwbex2hcfokcosxdknw.jpg', '');
INSERT INTO public.service_types VALUES (16, 14, 'Switch & socket', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066156/obfhntzjsdpltd7yg42d.jpg', '');
INSERT INTO public.service_types VALUES (17, 14, 'TV', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066253/h33f1i3qkkmusxjlp4u7.jpg', '');
INSERT INTO public.service_types VALUES (18, 14, 'Lights', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066433/tibhig3ndqrtuv4lnt9b.jpg', '');
INSERT INTO public.service_types VALUES (19, 14, 'Wiring', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066668/ccsht2a3t0ktnrd4i1oo.jpg', '');
INSERT INTO public.service_types VALUES (20, 14, 'MCB & Fuse', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066761/cdexruygbqoafacsybxx.jpg', '');
INSERT INTO public.service_types VALUES (21, 14, 'Door bell', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066825/nhowkkmavipsbj7eeh2t.jpg', '');
INSERT INTO public.service_types VALUES (22, 15, 'Door', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066906/ycw2roxt3c5te5lmvhil.jpg', '');
INSERT INTO public.service_types VALUES (23, 15, 'Drill & hang', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771066998/mm765ow4e32ywdwpuv7v.jpg', '');
INSERT INTO public.service_types VALUES (24, 15, 'Cupboard and Drawer', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771067563/yclnbvfeu2sykhfhzgiz.jpg', '');
INSERT INTO public.service_types VALUES (25, 15, 'Windows & curtain', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771067626/d9j2h6qhw6mpb9vgye4v.jpg', '');
INSERT INTO public.service_types VALUES (26, 15, 'Bed', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771067675/zmrxtarntkkqruqsc4et.jpg', '');
INSERT INTO public.service_types VALUES (27, 15, 'Furniture repair', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771067821/ek0bppolmfoed02ui5jp.jpg', '');
INSERT INTO public.service_types VALUES (28, 13, 'Tap & Mixer', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771069059/cqxj8zqsgl5wxgdti2wu.jpg', '');
INSERT INTO public.service_types VALUES (29, 13, 'Basin & Sink', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771069102/y5ma10ilpiipl1cumyyh.jpg', '');
INSERT INTO public.service_types VALUES (30, 13, 'Water pipe connection', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771069287/w0tk89jgsmrusl5yrzok.jpg', '');
INSERT INTO public.service_types VALUES (31, 13, 'Bath & Shower', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771069372/vbxq3ulczzil02nqkcfx.jpg', '');
INSERT INTO public.service_types VALUES (32, 13, 'Water Tank', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771069434/ufwmjrgybeeacsswpvar.jpg', '');
INSERT INTO public.service_types VALUES (33, 16, 'Interior Painting', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771070847/i2fjfpu8zplsbm9ubmyb.jpg', '');
INSERT INTO public.service_types VALUES (34, 16, 'Exterior Painting', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771070907/b2ixu6syrorfdg8e5q03.jpg', '');
INSERT INTO public.service_types VALUES (10, 7, 'Appliance Repair', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1771167259/j4k8ihpsfmwuhz0rxtjh.jpg', '');


--
-- Data for Name: service_updates; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.services VALUES (25, 8, 'Water Lekage Repair', 'will repair the water lekage in the ac', 759, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1770121965/utviwc7357kjtpgh1nxj.jpg', '[]', NULL, NULL);
INSERT INTO public.services VALUES (46, 22, 'Wooden Door Repair', '• Repair of 1 wooden door (alignment fixing, sanding & scraping, door jam fixing)', 200, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1775983744/lvuxo3chorclfxracwqx.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (37, 26, 'Bed Assembly', '• Complete bed frame assembly
• Includes headboard & support fitting
• Ensures stability and alignment', 800, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1774013211/rxnnniexrrx0r4pynb6m.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (38, 26, 'Bed Polishing', '• Surface sanding and polish application
• Removes minor scratches and dull finish
• Enhances shine and durability', 1300, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1774014728/t9usz4pjy3jusayt5xyr.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (39, 22, 'Door Installation', '• Installation of new wooden door
• Includes hinge fixing and alignment
• Basic fitting tools included
• Does not include door material', 1000, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1774014897/zbirzfwgi7tv9yubdjry.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (40, 22, 'Door Repair (Alignment / Hinge Issue)', '• Fix door alignment issues
• Repair loose or damaged hinges
• Smooth opening and closing adjustment
• Lubrication included', 400, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1774015390/qpqpe0bwfmqeo0l2pv9r.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (41, 22, 'Lock Installation / Replacement', '• Installation of new door lock
• Compatible with standard locks
• Testing and secure fitting included
• Lock cost not included', 300, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1774015555/ibajhs41gyvnokvufrkg.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (42, 10, 'Geyser Check up', '• Repair of one geyser unit
• Material charges additional, if any', 999, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1774789917/rvaoqoifke1vbddrnngn.jpg', '[]', 9, 1);
INSERT INTO public.services VALUES (43, 10, 'Geyser Check-Up', '• Repair of one geyser unit
• Repair of one geyser unit', 999, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1774791415/ykdqugwjzunkptv2g3sd.jpg', '[]', 9, 1);
INSERT INTO public.services VALUES (48, 25, 'Curtain Rod Installation', '• Installation of 1 curtain rod with 2 brackets', 150, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1775985773/zl5j1e2mv7cswukikdqq.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (49, 24, 'Cupboard Hinge Repair / Replacement', '• Installation, replacement or repair of up to 2 cupboard hinges', 100, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1776673556/neeoejpuqdvsohxwvzb0.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (50, 24, 'Cupboard Sliding Door Repair', '• Repair of 1 sliding door''s channel', 300, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1776675751/tgpkugzpryuv80b1mozk.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (51, 27, 'Sofa Assembly', '• Assembly of 1 sofa (up to 3 seaters)', 280, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1776676149/g7gzajbow2ateonj7437.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (52, 27, 'TV Unit Bench Assembly', '• A compact and stylish TV unit bench designed to support televisions while providing organized storage for media accessories', 500, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1776676510/kdxz1hvbknfoy4kbs0y0.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (53, 10, 'Geyser Check-Up', '• Repair of one geyser unit
• Material charges additional, if any', 240, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1776751627/r8qmr3mltflpgnj8adht.jpg', '[]', 9, 1);
INSERT INTO public.services VALUES (47, 22, 'Accessory Installation', '• Installation or replacement of 1 latch/ chain/ stopper/ magnet', 150, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1775984965/os5dogrdpbjwmbarhqmr.jpg', '[]', 9, NULL);
INSERT INTO public.services VALUES (45, 22, 'Door lock', '• Repair, installation, or replacement of a door lock', 170, 'https://res.cloudinary.com/dghdwtef5/image/upload/v1775981939/juwppnuyf7ja84abm5r5.jpg', '[]', 9, NULL);


--
-- Data for Name: tenant_members; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tenant_members VALUES (13, 12, 'Megumi Fushiguro', '7013527597', 'Self', true, '2026-02-16 19:58:13.287167', 'megumi123sai@gmail.com', NULL, NULL, 0, 1);
INSERT INTO public.tenant_members VALUES (16, 27, 'Manikanta Uzumaki', '9898345678', 'Self', true, '2026-03-15 20:13:16.187671', '22711a05c8@necn.ac.in', NULL, NULL, 0, 1);
INSERT INTO public.tenant_members VALUES (19, 30, 'Ramjaaly Jaswanth Raj', '8172817281', 'Self', true, '2026-04-17 01:09:00.036154', '22711a05b3@necn.ac.in', NULL, NULL, NULL, NULL);


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tenants VALUES (30, 38, 12, 'BACHELORS', 4499.00, 'PAID', '2026-04-17 01:08:59.991464', 52, '2026-04-17', '2026-04-17', '2026-04-17', NULL, 'Unpaid');
INSERT INTO public.tenants VALUES (12, 38, 12, 'BACHELORS', 4499.00, 'PAID', '2026-02-16 19:58:13.273443', 33, '2026-01-19', '2026-02-20', '2026-02-19', '2026-04-21 13:05:05.382372', 'Unpaid');
INSERT INTO public.tenants VALUES (27, 38, 8, 'BACHELORS', 6000.00, 'PAID', '2026-03-15 20:13:16.174354', 49, '2026-03-14', '2026-04-14', '2026-03-15', '2026-04-21 13:05:09.784787', 'Paid');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (28, 'Muttukuru', 'Sairam', 'admin123@gmail.com', '$2b$10$BpUAYNHpsnTn9MyZG7q7QushGZBrYSad6xDW5VKH3KN.sHuq67oEK', 'ADMIN', '2026-01-28 19:47:15.76683', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (31, 'Abhinav', 'Chaitanya', 'pvac2005@gmail.com', '$2b$10$Gf8u3APGeuDX9Ralmob1DOcSsvQqyjHhelOXPfEms8rS/pnTgVSe2', 'SERVICE_PROVIDER', '2026-02-05 13:16:01.918508', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (23, 'Sairam', 'Muttukuru', 'bhavanimuttukuru@gmail.com', '$2b$10$Du653m26J04pd5PDe2BwvOnAFH/gi/FJW56WJa0XuYHh8EctwCOdy', 'TENANT', '2026-01-28 12:12:50.471852', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1770293900/tyqfjpjnovmk3prypd4a.jpg', 'Active', '7013527597');
INSERT INTO public.users VALUES (32, 'ajay ', 'sai likhith', 'ajayvarikuti123@gmail.com', '$2b$10$c0rkkBhCUffJodoNk8fJfO9eiYDR5X5/uCRMNexgdTzJTVsf64pz2', 'SERVICE_PROVIDER', '2026-02-05 21:03:16.732385', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (33, 'Megumi', 'Fushiguro', 'megumi123sai@gmail.com', '$2b$10$JIYYnJsw9M0ajm1TJI1MhOfA2eOoK.NmI1LuqkfKN9zQd4Ieq6CQy', 'TENANT', '2026-02-14 18:27:31.396371', NULL, 'Active', '9989898980');
INSERT INTO public.users VALUES (37, 'Waseem', 'Shaik', 'nlearn.2k23011@gmail.com', '$2b$10$8HZ7D37gaC670M9YYtv6Nuc/SJtUKkJi933sjEvZ15iVwYS3y3V8e', 'SERVICE_PROVIDER', '2026-02-15 22:53:39.413405', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (39, 'Bhavani', 'Muttukuru', '22711a05a0@necn.ac.in', '$2b$10$xGkElSTYh79.k72ToyshMO.y4cMO1bM7Xl4uYKG2BG4xo2GGA6PaS', 'TENANT', '2026-02-17 18:28:31.360665', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (27, 'Test', 'Landlord', 'testlandlord_1769584137237@example.com', 'password123', 'LANDLORD', '2026-01-28 12:38:57.353653', NULL, 'Blocked', NULL);
INSERT INTO public.users VALUES (40, 'Ranganadh', 'Devayani', 'devildevi000@gmail.com', '$2b$10$xk5mzG/Fm2DLKXl1tBozWuvTnAJ0bWqvXkkbeIHISg2ag5UPl3Ykm', 'TENANT', '2026-02-18 14:27:13.407464', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (50, 'Bruce', 'Lee', 'bruceleesairam@gmail.com', '$2b$10$7nXBGUQ.gxArMgFKNz/um.6O.3/OTNMxW.ZBNjOBpadKI7GNk3ABa', 'TENANT', '2026-03-30 23:54:18.325424', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (29, 'Muttukuru', 'Sairam', 'sairammuttukuru.cse@gmail.com', '$2b$10$6uFZrts4O1XggSC8PxyWA.L4QRu0JCnToIz6r5RQlal5uFTu.13ZS', 'SERVICE_PROVIDER', '2026-01-28 21:02:02.410606', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (49, 'Manikanta', 'Uzumaki', '22711a05c8@necn.ac.in', '$2b$10$TzsYDviV17vxu9WMugdu2OonwWYLe4kiMDF3xZBDEs.zLfxxDSZeS', 'TENANT', '2026-03-15 20:09:13.349499', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (24, 'Muttukuru', 'Sairam', 'sairam123@gmail.com', '$2b$10$FS0L9Hd6g0oSUkbe/LN7MeE1uerC8ae52ok/yx0fAYu6U3JjutJeG', 'LANDLORD', '2026-01-28 12:16:15.060286', NULL, 'Active', '8855667722');
INSERT INTO public.users VALUES (52, 'Ramjaaly', 'Jaswanth Raj', '22711a05b3@necn.ac.in', '$2b$10$iNA2um/9hPCsv2KyMB017OY0U1sDRUpI5.A4OHsiwv4cjE1qCA0zi', 'TENANT', '2026-04-16 14:20:02.832363', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1776665815/jopm3fc2l8m4ulqz2g8z.jpg', 'Active', '0701352759');
INSERT INTO public.users VALUES (30, 'Uzumaki home services', '(Provider)', 'sairamkotiswarudu@gmail.com', '$2b$10$Gf8u3APGeuDX9Ralmob1DOcSsvQqyjHhelOXPfEms8rS/pnTgVSe2', 'SERVICE_PROVIDER', '2026-02-02 10:26:10.147987', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1770191608/gwspq6xkyrb78ij4csbk.jpg', 'Active', '9876543210');
INSERT INTO public.users VALUES (35, 'Toji', 'Zenin', 'sairamsuper1234@gmail.com', '$2b$10$Gf8u3APGeuDX9Ralmob1DOcSsvQqyjHhelOXPfEms8rS/pnTgVSe2', 'SERVICE_PROVIDER', '2026-02-15 22:37:53.570587', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (34, 'Toji', 'Zenin', 'toji123@gmail.com', '$2b$10$RKMjWEfXr9ZBN0iB6AXHx.9kIq5d.HI8HntpYxRIIckJSBlWtwmyu', 'SERVICE_PROVIDER', '2026-02-15 22:35:58.264257', NULL, 'Active', NULL);
INSERT INTO public.users VALUES (38, 'Manikanta', 'Vulavapati', 'sairammuttukuru5@gmail.com', '$2b$10$V8.WhLD6kC.phrQerDfwoOW6fFwUzVhfW9GcKv271YY33.O84Kqza', 'LANDLORD', '2026-02-16 17:45:42.410499', 'https://res.cloudinary.com/dghdwtef5/image/upload/v1776373413/dr9czoe71vbhrol7ujph.jpg', 'Active', '9125162717');
INSERT INTO public.users VALUES (53, 'Gaali ', 'Manoj', '22711a0595@necn.ac.in', '$2b$10$mCjUbWmC0B68r6PjcNLtY.p85d3Cw2CJ1Ebx1UTEQC8gQngOBXkUu', 'TENANT', '2026-04-17 10:26:52.640211', NULL, 'Active', NULL);


--
-- Data for Name: watchlist; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.watchlist VALUES (1, 49, 25, '2026-04-16 14:09:49.573215');
INSERT INTO public.watchlist VALUES (2, 52, 25, '2026-04-16 14:29:45.661757');


--
-- Name: admin_audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_audit_logs_id_seq', 51, true);


--
-- Name: amenities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.amenities_id_seq', 9, true);


--
-- Name: announcements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.announcements_id_seq', 5, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bookings_id_seq', 8, true);


--
-- Name: complaint_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaint_images_id_seq', 10, true);


--
-- Name: complaints_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.complaints_id_seq', 13, true);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.messages_id_seq', 19, true);


--
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notifications_id_seq', 33, true);


--
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.properties_id_seq', 25, true);


--
-- Name: property_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.property_images_id_seq', 62, true);


--
-- Name: provider_earnings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.provider_earnings_id_seq', 1, false);


--
-- Name: provider_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.provider_services_id_seq', 34, true);


--
-- Name: rent_payments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.rent_payments_id_seq', 40, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.reviews_id_seq', 7, true);


--
-- Name: service_categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_categories_id_seq', 18, true);


--
-- Name: service_providers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_providers_id_seq', 14, true);


--
-- Name: service_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_requests_id_seq', 36, true);


--
-- Name: service_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_reviews_id_seq', 3, true);


--
-- Name: service_slots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_slots_id_seq', 4, true);


--
-- Name: service_sub_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_sub_types_id_seq', 9, true);


--
-- Name: service_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_types_id_seq', 34, true);


--
-- Name: service_updates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.service_updates_id_seq', 1, false);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.services_id_seq', 54, true);


--
-- Name: tenant_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tenant_members_id_seq', 19, true);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tenants_id_seq', 30, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 53, true);


--
-- Name: watchlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.watchlist_id_seq', 2, true);


--
-- Name: admin_audit_logs admin_audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_pkey PRIMARY KEY (id);


--
-- Name: amenities amenities_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_name_key UNIQUE (name);


--
-- Name: amenities amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: complaint_images complaint_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_images
    ADD CONSTRAINT complaint_images_pkey PRIMARY KEY (id);


--
-- Name: complaints complaints_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: properties properties_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_pkey PRIMARY KEY (id);


--
-- Name: property_amenities property_amenities_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_amenities
    ADD CONSTRAINT property_amenities_pkey PRIMARY KEY (property_id, amenity_id);


--
-- Name: property_images property_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_pkey PRIMARY KEY (id);


--
-- Name: provider_earnings provider_earnings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_earnings
    ADD CONSTRAINT provider_earnings_pkey PRIMARY KEY (id);


--
-- Name: provider_services provider_services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_services
    ADD CONSTRAINT provider_services_pkey PRIMARY KEY (id);


--
-- Name: rent_payments rent_payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rent_payments
    ADD CONSTRAINT rent_payments_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: service_categories service_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_pkey PRIMARY KEY (id);


--
-- Name: service_providers service_providers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT service_providers_pkey PRIMARY KEY (id);


--
-- Name: service_requests service_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_pkey PRIMARY KEY (id);


--
-- Name: service_reviews service_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_pkey PRIMARY KEY (id);


--
-- Name: service_slots service_slots_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_slots
    ADD CONSTRAINT service_slots_pkey PRIMARY KEY (id);


--
-- Name: service_sub_types service_sub_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_sub_types
    ADD CONSTRAINT service_sub_types_pkey PRIMARY KEY (id);


--
-- Name: service_types service_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_pkey PRIMARY KEY (id);


--
-- Name: service_updates service_updates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_updates
    ADD CONSTRAINT service_updates_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: tenant_members tenant_members_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_members
    ADD CONSTRAINT tenant_members_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: watchlist watchlist_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_pkey PRIMARY KEY (id);


--
-- Name: watchlist watchlist_user_id_property_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_user_id_property_id_key UNIQUE (user_id, property_id);


--
-- Name: idx_messages_conversation; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_conversation ON public.messages USING btree (sender_id, receiver_id);


--
-- Name: idx_messages_receiver; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_receiver ON public.messages USING btree (receiver_id);


--
-- Name: idx_messages_sender; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_messages_sender ON public.messages USING btree (sender_id);


--
-- Name: one_primary_member_per_tenant; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX one_primary_member_per_tenant ON public.tenant_members USING btree (tenant_id) WHERE (is_primary = true);


--
-- Name: admin_audit_logs admin_audit_logs_admin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_audit_logs
    ADD CONSTRAINT admin_audit_logs_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.users(id);


--
-- Name: amenities amenities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.amenities
    ADD CONSTRAINT amenities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: announcements announcements_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: announcements announcements_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: announcements announcements_target_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_target_tenant_id_fkey FOREIGN KEY (target_tenant_id) REFERENCES public.tenants(id) ON DELETE SET NULL;


--
-- Name: bookings bookings_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: complaint_images complaint_images_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaint_images
    ADD CONSTRAINT complaint_images_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES public.complaints(id) ON DELETE CASCADE;


--
-- Name: complaints complaints_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: complaints complaints_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: complaints complaints_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: service_providers fk_service_provider_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_providers
    ADD CONSTRAINT fk_service_provider_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: service_slots fk_slot_provider; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_slots
    ADD CONSTRAINT fk_slot_provider FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: service_slots fk_slot_request; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_slots
    ADD CONSTRAINT fk_slot_request FOREIGN KEY (service_request_id) REFERENCES public.service_requests(id) ON DELETE CASCADE;


--
-- Name: messages messages_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE SET NULL;


--
-- Name: messages messages_receiver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_receiver_id_fkey FOREIGN KEY (receiver_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: messages messages_sender_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_sender_id_fkey FOREIGN KEY (sender_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: properties properties_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.properties
    ADD CONSTRAINT properties_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: property_amenities property_amenities_amenity_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_amenities
    ADD CONSTRAINT property_amenities_amenity_id_fkey FOREIGN KEY (amenity_id) REFERENCES public.amenities(id) ON DELETE CASCADE;


--
-- Name: property_amenities property_amenities_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_amenities
    ADD CONSTRAINT property_amenities_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: property_images property_images_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.property_images
    ADD CONSTRAINT property_images_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: provider_earnings provider_earnings_service_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_earnings
    ADD CONSTRAINT provider_earnings_service_request_id_fkey FOREIGN KEY (service_request_id) REFERENCES public.service_requests(id);


--
-- Name: provider_services provider_services_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_services
    ADD CONSTRAINT provider_services_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: provider_services provider_services_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provider_services
    ADD CONSTRAINT provider_services_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.services(id) ON DELETE CASCADE;


--
-- Name: rent_payments rent_payments_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rent_payments
    ADD CONSTRAINT rent_payments_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id);


--
-- Name: rent_payments rent_payments_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.rent_payments
    ADD CONSTRAINT rent_payments_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.service_requests(id);


--
-- Name: reviews reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: service_categories service_categories_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_categories
    ADD CONSTRAINT service_categories_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: service_requests service_requests_complaint_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_complaint_id_fkey FOREIGN KEY (complaint_id) REFERENCES public.complaints(id) ON DELETE SET NULL;


--
-- Name: service_requests service_requests_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: service_requests service_requests_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: service_requests service_requests_provider_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_provider_service_id_fkey FOREIGN KEY (provider_service_id) REFERENCES public.provider_services(id);


--
-- Name: service_requests service_requests_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: service_requests service_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_requests
    ADD CONSTRAINT service_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: service_reviews service_reviews_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: service_reviews service_reviews_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_reviews
    ADD CONSTRAINT service_reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: service_sub_types service_sub_types_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_sub_types
    ADD CONSTRAINT service_sub_types_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.service_types(id) ON DELETE CASCADE;


--
-- Name: service_types service_types_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_types
    ADD CONSTRAINT service_types_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.service_categories(id) ON DELETE CASCADE;


--
-- Name: service_updates service_updates_service_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.service_updates
    ADD CONSTRAINT service_updates_service_request_id_fkey FOREIGN KEY (service_request_id) REFERENCES public.service_requests(id) ON DELETE CASCADE;


--
-- Name: services services_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_provider_id_fkey FOREIGN KEY (provider_id) REFERENCES public.service_providers(id) ON DELETE CASCADE;


--
-- Name: services services_sub_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_sub_type_id_fkey FOREIGN KEY (sub_type_id) REFERENCES public.service_sub_types(id) ON DELETE SET NULL;


--
-- Name: services services_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_type_id_fkey FOREIGN KEY (type_id) REFERENCES public.service_types(id) ON DELETE CASCADE;


--
-- Name: tenant_members tenant_members_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenant_members
    ADD CONSTRAINT tenant_members_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenants tenants_landlord_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_landlord_id_fkey FOREIGN KEY (landlord_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: tenants tenants_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: tenants tenants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: watchlist watchlist_property_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_property_id_fkey FOREIGN KEY (property_id) REFERENCES public.properties(id) ON DELETE CASCADE;


--
-- Name: watchlist watchlist_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.watchlist
    ADD CONSTRAINT watchlist_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict OrpcL23d9yry731dJrdvi4TBylEXLU1BWUcNgpKh8aN3cCYbHIDVQe2bJGXPTSn

