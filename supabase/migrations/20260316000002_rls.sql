-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brain_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_settings ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Admins and members can view all profiles"
    ON public.profiles FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.profiles p 
        WHERE p.id = auth.uid() AND p.role IN ('admin', 'member')
    ));

CREATE POLICY "Users can view their own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- 2. Clients Policies
CREATE POLICY "Staff can manage all clients"
    ON public.clients FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'member')
    ));

CREATE POLICY "Clients can view their own record"
    ON public.clients FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.client_users WHERE client_id = public.clients.id AND profile_id = auth.uid()
    ));

-- 3. Invoices Policies
CREATE POLICY "Staff can manage all invoices"
    ON public.invoices FOR ALL
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'member')
    ));

CREATE POLICY "Clients can view their own invoices"
    ON public.invoices FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.client_users WHERE client_id = public.invoices.client_id AND profile_id = auth.uid()
    ));

-- 4. Agency Settings
CREATE POLICY "Everyone can view agency settings"
    ON public.agency_settings FOR SELECT
    USING (true);

CREATE POLICY "Only admins can update agency settings"
    ON public.agency_settings FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    ));
