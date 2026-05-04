import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface LoginRequest {
  email: string;
  password: string;
  action: 'login' | 'create';
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { email, password, action }: LoginRequest = await req.json();

    if (action === 'create') {
      const passwordHash = await hashPassword(password);

      const { data, error } = await supabase
        .from('admin_users')
        .insert({
          email,
          password_hash: passwordHash,
          full_name: 'Admin',
        })
        .select()
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (action === 'login') {
      const { data: admin, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error || !admin) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      const isValid = await verifyPassword(password, admin.password_hash);

      if (!isValid) {
        return new Response(
          JSON.stringify({ success: false, error: 'Invalid credentials' }),
          {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      await supabase
        .from('admin_users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', admin.id);

      return new Response(
        JSON.stringify({ success: true, email: admin.email }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}
