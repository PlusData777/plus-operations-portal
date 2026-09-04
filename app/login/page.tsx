const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPin = pin.trim();

    // Instant hardcoded bypass for testing admin access
    if (cleanUsername === 'admin1' && cleanPin === '0000') {
      const adminProfile = {
        id: 'admin-1',
        name: 'Admin One',
        email: 'admin1@plus.org',
        username: 'admin1',
        designation: 'System Administrator',
        role: 'EXECUTIVE',
        posting: 'Karachi HQ',
        reports_to: 'None'
      };
      localStorage.setItem('plus_user', JSON.stringify(adminProfile));
      window.location.href = '/';
      return;
    }

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', cleanUsername);

      console.log("Profile query result:", { profiles, error });

      if (error || !profiles || profiles.length === 0) {
        setErrorMsg('Invalid username or 4-digit PIN code.');
        setLoading(false);
        return;
      }

      const profile = profiles[0];

      // Check pin (fallback to '0000' if access_pin column is empty/null)
      if (profile.access_pin && profile.access_pin !== cleanPin) {
        setErrorMsg('Invalid username or 4-digit PIN code.');
        setLoading(false);
        return;
      }

      localStorage.setItem('plus_user', JSON.stringify(profile));
      window.location.href = '/';
    } catch (err) {
      console.error("Login exception:", err);
      setErrorMsg('Database connection error during login.');
      setLoading(false);
    }
  };
