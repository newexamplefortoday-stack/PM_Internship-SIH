import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, applicationId, newStatus } = await req.json();
    
    // Create Supabase client with service role key
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: { persistSession: false }
      }
    );

    console.log(`Admin operation: ${action}`, { applicationId, newStatus });

    if (action === 'fetch_applications') {
      // Fetch all applications with related data
      const { data: applications, error: appsError } = await supabase
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false });

      if (appsError) {
        console.error('Error fetching applications:', appsError);
        throw appsError;
      }

      // Get unique internship and user IDs
      const internshipIds = [...new Set(applications?.map(app => app.internship_id))];
      const userIds = [...new Set(applications?.map(app => app.user_id))];

      // Fetch internships and profiles
      const [internshipsResponse, profilesResponse] = await Promise.all([
        supabase.from('internships').select('id, title, required_skills').in('id', internshipIds),
        supabase.from('profiles').select('user_id, name, age, mobile, education, location, skills').in('user_id', userIds)
      ]);

      // Combine data with compatibility scoring
      const enrichedApplications = applications?.map(app => {
        const internship = internshipsResponse.data?.find(i => i.id === app.internship_id) || {
          id: app.internship_id,
          title: 'Unknown',
          required_skills: []
        };
        
        const profile = profilesResponse.data?.find(p => p.user_id === app.user_id) || {
          name: 'Unknown',
          age: 0,
          mobile: '',
          education: '',
          location: '',
          skills: []
        };

        // Calculate compatibility score
        const requiredSkills = internship.required_skills || [];
        const candidateSkills = profile.skills || [];
        const matchingSkills = candidateSkills.filter((skill: string) =>
          requiredSkills.some((reqSkill: string) =>
            skill.toLowerCase().includes(reqSkill.toLowerCase()) ||
            reqSkill.toLowerCase().includes(skill.toLowerCase())
          )
        );
        const compatibilityScore = requiredSkills.length > 0
          ? Math.round((matchingSkills.length / requiredSkills.length) * 100)
          : 0;

        return {
          ...app,
          internship,
          profile,
          compatibility_score: compatibilityScore
        };
      }) || [];

      // Sort by compatibility score (highest first)
      enrichedApplications.sort((a, b) => b.compatibility_score - a.compatibility_score);

      console.log(`Found ${enrichedApplications.length} applications`);

      return new Response(JSON.stringify({ applications: enrichedApplications }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update_status') {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application status:', error);
        throw error;
      }

      console.log(`Application ${applicationId} status updated to ${newStatus}`);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in admin-operations function:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});