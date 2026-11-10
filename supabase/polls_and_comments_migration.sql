-- ========================================================
-- POLLS & COMMENTS ENHANCEMENTS FOR SADA NEWS
-- ========================================================

-- 1. Ensure comments table has likes_count
ALTER TABLE IF EXISTS public.comments 
ADD COLUMN IF NOT EXISTS likes_count INTEGER DEFAULT 0 NOT NULL;

-- 2. Article Polls Table
CREATE TABLE IF NOT EXISTS public.article_polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Poll Options Table
CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES public.article_polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    votes_count INTEGER DEFAULT 0 NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL
);

-- 4. Poll Votes Table (to prevent duplicate spam)
CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES public.article_polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
    voter_ip TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_comments_article ON public.comments(article_id);
CREATE INDEX IF NOT EXISTS idx_polls_article ON public.article_polls(article_id);
CREATE INDEX IF NOT EXISTS idx_poll_options_poll ON public.poll_options(poll_id);

-- RLS POLICIES
ALTER TABLE public.article_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Readable by all
DROP POLICY IF EXISTS "Polls readable by everyone" ON public.article_polls;
CREATE POLICY "Polls readable by everyone" ON public.article_polls FOR SELECT USING (true);

DROP POLICY IF EXISTS "Poll options readable by everyone" ON public.poll_options;
CREATE POLICY "Poll options readable by everyone" ON public.poll_options FOR SELECT USING (true);

-- Anyone can submit a vote
DROP POLICY IF EXISTS "Anyone can vote in polls" ON public.poll_votes;
CREATE POLICY "Anyone can vote in polls" ON public.poll_votes FOR INSERT WITH CHECK (true);
