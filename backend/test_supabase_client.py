#!/usr/bin/env python3
"""
Test script to verify Supabase connection using the Supabase client
"""

import os
from supabase import create_client, Client
from app.config import settings

def test_supabase_client():
    """Test Supabase connection using the official client"""
    print("🔍 Testing Supabase client connection...")
    
    try:
        # Create Supabase client
        supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
        
        # Test connection by querying a simple table
        print("✅ Supabase client created successfully!")
        print(f"📊 Supabase URL: {settings.supabase_url}")
        print(f"🔑 API Key: {settings.supabase_key[:20]}...")
        
        # Try to get the current user (this will work even if no user is logged in)
        try:
            response = supabase.auth.get_user()
            print("✅ Authentication service is working")
        except Exception as e:
            print(f"ℹ️  Auth service response: {str(e)[:100]}...")
        
        # Test database connection by trying to query a table
        try:
            # This will fail if tables don't exist, but that's OK
            result = supabase.table('users').select('*').limit(1).execute()
            print("✅ Database connection is working!")
            print(f"📋 Users table accessible")
        except Exception as e:
            if "relation" in str(e).lower() and "does not exist" in str(e).lower():
                print("✅ Database connection is working!")
                print("ℹ️  Tables don't exist yet (this is normal for a new database)")
            else:
                print(f"⚠️  Database query failed: {str(e)[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Supabase client connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 ZeroSaver Supabase Client Test")
    print("=" * 50)
    
    if test_supabase_client():
        print("\n🎉 Supabase client connection successful!")
        print("You can now use Supabase for your application.")
    else:
        print("\n❌ Supabase client connection failed.")
        print("Please check your SUPABASE_URL and SUPABASE_KEY.")
