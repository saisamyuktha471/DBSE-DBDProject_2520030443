import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Edit3,
  Save,
} from "lucide-react";

function Profile() {
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  // Load registered customer information
  useEffect(() => {
    const savedUser =
      JSON.parse(
        localStorage.getItem("retailhubUser")
      ) || {};

    setProfile({
      name: savedUser.name || "",
      email: savedUser.email || "",
      phone: savedUser.phone || "",
      address: savedUser.address || "",
      city: savedUser.city || "Hyderabad",
      pincode: savedUser.pincode || "",
    });
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    const existingUser =
      JSON.parse(
        localStorage.getItem("retailhubUser")
      ) || {};

    const updatedUser = {
      ...existingUser,
      ...profile,
    };

    localStorage.setItem(
      "retailhubUser",
      JSON.stringify(updatedUser)
    );

    setProfile(updatedUser);
    setEditing(false);

    alert("Profile updated successfully.");
  };

  return (
    <div className="standard-page">

      {/* HEADER */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            CUSTOMER ACCOUNT
          </span>

          <h1>My Profile</h1>

          <p>
            Manage your personal information and
            account details.
          </p>

        </div>

        {!editing ? (

          <button
            className="primary-button"
            onClick={() => setEditing(true)}
          >
            <Edit3 size={17} />
            Edit Profile
          </button>

        ) : (

          <button
            className="primary-button"
            onClick={handleSave}
          >
            <Save size={17} />
            Save Changes
          </button>

        )}

      </div>

      {/* PROFILE LAYOUT */}

      <div className="profile-layout">

        {/* PROFILE CARD */}

        <section className="profile-card">

          <div className="profile-top">

            <div className="profile-avatar">
              <User size={38} />
            </div>

            <div>

              <h2>
                {profile.name || "Customer"}
              </h2>

              <p>
                RetailHub Customer
              </p>

            </div>

          </div>

          <div className="profile-divider"></div>

          {/* PERSONAL INFORMATION */}

          <div className="profile-section">

            <div className="profile-section-title">

              <div className="profile-title-icon">
                <User size={18} />
              </div>

              <div>

                <h3>
                  Personal Information
                </h3>

                <p>
                  Your basic account information
                </p>

              </div>

            </div>

            <div className="profile-form-grid">

              <div className="form-group">

                <label>
                  Full Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

              <div className="form-group">

                <label>
                  Email Address
                </label>

                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

              <div className="form-group">

                <label>
                  Phone Number
                </label>

                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

            </div>

          </div>

          {/* ADDRESS */}

          <div className="profile-section">

            <div className="profile-section-title">

              <div className="profile-title-icon">
                <MapPin size={18} />
              </div>

              <div>

                <h3>
                  Delivery Address
                </h3>

                <p>
                  Address used for your orders
                </p>

              </div>

            </div>

            <div className="profile-form-grid">

              <div className="form-group profile-full">

                <label>
                  Address
                </label>

                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

              <div className="form-group">

                <label>
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

              <div className="form-group">

                <label>
                  PIN Code
                </label>

                <input
                  type="text"
                  name="pincode"
                  value={profile.pincode}
                  onChange={handleChange}
                  disabled={!editing}
                />

              </div>

            </div>

          </div>

        </section>

        {/* RIGHT SIDE */}

        <aside>

          {/* ACCOUNT STATUS */}

          <div className="account-status-card">

            <div className="account-status-icon">
              <ShieldCheck size={25} />
            </div>

            <h3>
              Account Secure
            </h3>

            <p>
              Your RetailHub account information
              is protected.
            </p>

            <div className="secure-status">

              <span></span>

              Account Active

            </div>

          </div>

          {/* CONTACT DETAILS */}

          <div className="contact-card">

            <h3>
              Contact Information
            </h3>

            <div className="contact-item">

              <Mail size={17} />

              <span>
                {profile.email || "Not provided"}
              </span>

            </div>

            <div className="contact-item">

              <Phone size={17} />

              <span>
                {profile.phone || "Not provided"}
              </span>

            </div>

            <div className="contact-item">

              <MapPin size={17} />

              <span>
                {profile.city || "Not provided"}
                {profile.pincode
                  ? `, ${profile.pincode}`
                  : ""}
              </span>

            </div>

          </div>

        </aside>

      </div>

    </div>
  );
}

export default Profile;