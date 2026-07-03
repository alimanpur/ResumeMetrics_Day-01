-- Phase 19: Add missing intelligence columns to analyses table
-- This migration adds columns used by the comprehensive analysis engine

ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "comprehensiveReport" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "executiveSummary" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "credibilityAnalysis" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "skillsIntelligence" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "experienceIntelligence" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "projectIntelligence" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "interviewPrep" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "learningRoadmap" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "resumeEvolution" JSONB;
ALTER TABLE "analyses" ADD COLUMN IF NOT EXISTS "recruiterAnalysis" JSONB;
