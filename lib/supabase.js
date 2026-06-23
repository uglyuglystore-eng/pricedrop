import{createClient}from'@supabase/supabase-js'
export const supabase=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
export function supabaseAdmin(){return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,process.env.SUPABASE_SERVICE_ROLE_KEY,{auth:{autoRefreshToken:false,persistSession:false}})}
export async function deleteProductImage(url){const db=supabaseAdmin();const path=url.split('/product-images/')[1];if(!path)return;await db.storage.from('product-images').remove([path])}
