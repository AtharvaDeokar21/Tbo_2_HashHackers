--
-- PostgreSQL database dump
--

\restrict sCG23xlMmvBlbPy3l7NJC0pWH1QPP2P7KLStFv1olypQj6xptoXeRKYZ6s1Udp3

-- Dumped from database version 18.2
-- Dumped by pg_dump version 18.2

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

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: agents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agents (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(150) NOT NULL,
    email character varying(150) NOT NULL,
    phone character varying(20),
    agency_name character varying(200),
    city character varying(100),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.agents OWNER TO postgres;

--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--



--
-- Name: chat_memory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_memory (
    id uuid NOT NULL,
    itinerary_id uuid,
    role character varying(20),
    message text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.chat_memory OWNER TO postgres;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.customers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    agent_id uuid,
    name character varying(150),
    email character varying(150),
    phone character varying(20),
    source_city character varying(100),
    budget_range character varying(50),
    risk_preference character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.customers OWNER TO postgres;

--
-- Name: event_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_type character varying(50),
    entity_id uuid,
    event_type character varying(100),
    metadata jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.event_logs OWNER TO postgres;

--
-- Name: flight_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.flight_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    itinerary_id uuid,
    airline character varying(100),
    flight_number character varying(50),
    departure_time timestamp without time zone,
    arrival_time timestamp without time zone,
    layover_minutes integer,
    price numeric,
    volatility_indicator character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    departure_airport character varying(10),
    arrival_airport character varying(10),
    travel_class character varying(50),
    aircraft character varying(100),
    legroom character varying(50),
    duration_minutes integer,
    layover_count integer,
    max_layover_minutes integer,
    overnight_layover boolean,
    carbon_emissions integer,
    emission_delta_percent double precision,
    booking_token text
);


ALTER TABLE public.flight_options OWNER TO postgres;

--
-- Name: hotel_options; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hotel_options (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    itinerary_id uuid,
    hotel_name character varying(200),
    rating numeric,
    location character varying(200),
    room_type character varying(150),
    price numeric,
    inventory_status character varying(50),
    created_at timestamp without time zone DEFAULT now(),
    reviews integer,
    hotel_class character varying(50),
    total_price numeric,
    latitude double precision,
    longitude double precision,
    amenities jsonb,
    check_in character varying(50),
    check_out character varying(50),
    image_url character varying(500)
);


ALTER TABLE public.hotel_options OWNER TO postgres;

--
-- Name: itineraries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.itineraries (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trip_id uuid,
    total_price numeric,
    cost_score numeric,
    comfort_score numeric,
    risk_score numeric,
    margin_score numeric,
    final_score numeric,
    confidence_score numeric,
    risk_level character varying(50),
    margin_band character varying(50),
    tradeoff_summary text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.itineraries OWNER TO postgres;

--
-- Name: margin_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.margin_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    itinerary_id uuid,
    base_cost numeric,
    markup numeric,
    commission_percent numeric,
    net_margin numeric,
    margin_band character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.margin_snapshots OWNER TO postgres;

--
-- Name: price_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.price_history (
    id uuid NOT NULL,
    itinerary_id uuid,
    flight_price numeric,
    hotel_price numeric,
    total_price numeric,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.price_history OWNER TO postgres;

--
-- Name: risk_snapshots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.risk_snapshots (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    itinerary_id uuid,
    fare_volatility_score numeric,
    connection_risk_score numeric,
    inventory_risk_score numeric,
    overall_risk_level character varying(50),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.risk_snapshots OWNER TO postgres;

--
-- Name: trip_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trip_plans (
    id uuid NOT NULL,
    trip_id uuid,
    structured_plan json,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.trip_plans OWNER TO postgres;

--
-- Name: trips; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trips (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    customer_id uuid,
    origin_airport character varying(10),
    destination_airport character varying(10),
    destination_city character varying(100),
    departure_date date,
    return_date date,
    duration_days integer,
    budget numeric,
    travel_style character varying(100),
    status character varying(50) DEFAULT 'planning'::character varying,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.trips OWNER TO postgres;

--
-- Name: agents agents_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_email_key UNIQUE (email);


--
-- Name: agents agents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agents
    ADD CONSTRAINT agents_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: chat_memory chat_memory_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_memory
    ADD CONSTRAINT chat_memory_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: event_logs event_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_logs
    ADD CONSTRAINT event_logs_pkey PRIMARY KEY (id);


--
-- Name: flight_options flight_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight_options
    ADD CONSTRAINT flight_options_pkey PRIMARY KEY (id);


--
-- Name: hotel_options hotel_options_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel_options
    ADD CONSTRAINT hotel_options_pkey PRIMARY KEY (id);


--
-- Name: itineraries itineraries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraries
    ADD CONSTRAINT itineraries_pkey PRIMARY KEY (id);


--
-- Name: margin_snapshots margin_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.margin_snapshots
    ADD CONSTRAINT margin_snapshots_pkey PRIMARY KEY (id);


--
-- Name: price_history price_history_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_pkey PRIMARY KEY (id);


--
-- Name: risk_snapshots risk_snapshots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_snapshots
    ADD CONSTRAINT risk_snapshots_pkey PRIMARY KEY (id);


--
-- Name: trip_plans trip_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_plans
    ADD CONSTRAINT trip_plans_pkey PRIMARY KEY (id);


--
-- Name: trips trips_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_pkey PRIMARY KEY (id);


--
-- Name: idx_flight_itinerary_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_flight_itinerary_id ON public.flight_options USING btree (itinerary_id);


--
-- Name: idx_hotel_itinerary_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hotel_itinerary_id ON public.hotel_options USING btree (itinerary_id);


--
-- Name: idx_itinerary_trip_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_itinerary_trip_id ON public.itineraries USING btree (trip_id);


--
-- Name: campaigns campaigns_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- Name: customers customers_agent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES public.agents(id) ON DELETE CASCADE;


--
-- Name: flight_options flight_options_itinerary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.flight_options
    ADD CONSTRAINT flight_options_itinerary_id_fkey FOREIGN KEY (itinerary_id) REFERENCES public.itineraries(id) ON DELETE CASCADE;


--
-- Name: hotel_options hotel_options_itinerary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hotel_options
    ADD CONSTRAINT hotel_options_itinerary_id_fkey FOREIGN KEY (itinerary_id) REFERENCES public.itineraries(id) ON DELETE CASCADE;


--
-- Name: itineraries itineraries_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.itineraries
    ADD CONSTRAINT itineraries_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: margin_snapshots margin_snapshots_itinerary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.margin_snapshots
    ADD CONSTRAINT margin_snapshots_itinerary_id_fkey FOREIGN KEY (itinerary_id) REFERENCES public.itineraries(id) ON DELETE CASCADE;


--
-- Name: price_history price_history_itinerary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.price_history
    ADD CONSTRAINT price_history_itinerary_id_fkey FOREIGN KEY (itinerary_id) REFERENCES public.itineraries(id) ON DELETE CASCADE;


--
-- Name: risk_snapshots risk_snapshots_itinerary_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.risk_snapshots
    ADD CONSTRAINT risk_snapshots_itinerary_id_fkey FOREIGN KEY (itinerary_id) REFERENCES public.itineraries(id) ON DELETE CASCADE;


--
-- Name: trip_plans trip_plans_trip_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trip_plans
    ADD CONSTRAINT trip_plans_trip_id_fkey FOREIGN KEY (trip_id) REFERENCES public.trips(id) ON DELETE CASCADE;


--
-- Name: trips trips_customer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trips
    ADD CONSTRAINT trips_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict sCG23xlMmvBlbPy3l7NJC0pWH1QPP2P7KLStFv1olypQj6xptoXeRKYZ6s1Udp3

