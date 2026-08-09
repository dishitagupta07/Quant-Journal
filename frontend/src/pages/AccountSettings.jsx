import "./AccountSettings.css";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {
    MdPerson,
    MdTune,
    MdSecurity,
    MdEmail,
    MdDarkMode,
    MdLock,
    MdVerifiedUser,
    MdEdit
} from "react-icons/md";

function AccountSettings() {
    const { user, setUser } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [twoFactor, setTwoFactor] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordMessage, setPasswordMessage] = useState("");

    const [profileData, setProfileData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        username: user?.username || "",
        phone: user?.phone || "",
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                fullName: user.fullName || "",
                email: user.email || "",
                username: user.username || "",
                phone: user.phone || "",
            });
        }
    }, [user]);

    const handleSaveProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8000/api/users/profile",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(profileData),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to update profile");
            }

            setUser(data.user);
            setEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Profile update error:", error);
            alert("Failed to update profile");
        }
    };

    const handleChangePassword = async () => {
        if (newPassword !== confirmPassword) {
            setPasswordMessage("Passwords do not match");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8000/api/users/change-password",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setPasswordMessage(data.message);
                return;
            }

            setPasswordMessage("Password changed successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            console.error(error);
            setPasswordMessage("Something went wrong");
        }
    };

    return (
        <div className={`dashboard-container ${darkMode ? "dark-mode" : ""}`}>
            <Sidebar />

            <div className="main-wrapper">
                <TopNavbar />

                <div className="main-content">
                    <h1>My Account & Settings</h1>

                    {/* ================= ACCOUNT HEADER ================= */}
                    <div className="account-header">
                        <div className="profile-section">
                            <div className="profile-avatar">
                                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : "U"}
                            </div>

                            <div className="profile-info">
                                <h1>{user?.fullName}</h1>
                                <p>{user?.email}</p>
                            </div>
                        </div>

                        <button
                            className="edit-profile-btn"
                            onClick={() => {
                                if (editing) {
                                    handleSaveProfile();
                                } else {
                                    setEditing(true);
                                }
                            }}
                        >
                            <MdEdit className="section-icon" />
                            {editing ? "Save Changes" : "Edit Profile"}
                        </button>
                    </div>

                    {/* ================= PROFILE INFORMATION ================= */}
                    <div className="profile-details-card">
                        <div className="section-header">
                            <h2>
                                <MdPerson className="section-icon" /> Personal Information
                            </h2>
                            <p>Manage your basic account information.</p>
                        </div>

                        <div className="profile-details-grid">
                            <div className="input-group">
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    value={profileData.fullName}
                                    readOnly={!editing}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            fullName: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="input-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={profileData.email}
                                    readOnly={!editing}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            email: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="input-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    value={profileData.username}
                                    readOnly={!editing}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            username: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            <div className="input-group">
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    value={profileData.phone}
                                    readOnly={!editing}
                                    onChange={(e) =>
                                        setProfileData({
                                            ...profileData,
                                            phone: e.target.value,
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* ================= PREFERENCES ================= */}
                    <div className="settings-card">
                        <div className="section-header">
                            <h2>
                                <MdTune className="section-icon" /> Preferences
                            </h2>
                            <p>Customize your account experience.</p>
                        </div>

                        <div className="settings-option">
                            <div>
                                <h4>
                                    <MdEmail className="section-icon" /> Email Notifications
                                </h4>
                                <p>Receive trade updates and summaries.</p>
                            </div>

                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={emailNotifications}
                                    onChange={(e) => setEmailNotifications(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>

                        <div className="settings-option">
                            <div>
                                <h4>
                                    <MdDarkMode className="section-icon" /> Dark Mode
                                </h4>
                                <p>Switch between light and dark theme.</p>
                            </div>

                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={darkMode}
                                    onChange={(e) => setDarkMode(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* ================= SECURITY ================= */}
                    <div className="security-card">
                        <div className="section-header">
                            <h2>
                                <MdSecurity className="section-icon" /> Security
                            </h2>
                            <p>Keep your account protected.</p>
                        </div>

                        <div className="security-item">
                            <div>
                                <h4>
                                    <MdLock className="section-icon" /> Password
                                </h4>
                                <p>Last changed 14 days ago.</p>
                            </div>

                            <button
                                className="secondary-btn"
                                onClick={() => setShowPasswordModal(true)}
                            >
                                Change Password
                            </button>
                        </div>

                        <div className="security-item">
                            <div>
                                <h4>
                                    <MdVerifiedUser className="section-icon" /> Two-Factor
                                    Authentication
                                </h4>
                                <p>Add extra security to your account.</p>
                            </div>

                            <label className="switch">
                                <input
                                    type="checkbox"
                                    checked={twoFactor}
                                    onChange={(e) => setTwoFactor(e.target.checked)}
                                />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>

                    {/* ================= DANGER ZONE ================= */}
                    <div className="danger-card">
                        <div className="section-header">
                            <h2>Danger Zone</h2>
                            <p>These actions are permanent and cannot be undone.</p>
                        </div>

                        <div className="danger-row">
                            <div>
                                <h4>Delete Account</h4>
                                <p>Delete your account along with all trades and analytics.</p>
                            </div>

                            <button
                                className="danger-btn"
                                onClick={() => setShowDeleteModal(true)}
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>

                    {showDeleteModal && (
                        <div className="delete-modal-overlay">
                            <div className="delete-modal">
                                <h2>Delete Account?</h2>
                                <p>
                                    This will permanently delete your account and all your trades.
                                    This action cannot be undone.
                                </p>

                                <div className="delete-modal-actions">
                                    <button
                                        className="cancel-btn"
                                        onClick={() => setShowDeleteModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button className="confirm-delete-btn">
                                        Yes, Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {showPasswordModal && (
                    <div className="password-modal-overlay">
                        <div className="password-modal">
                            <h2>Change Password</h2>

                            <input
                                type="password"
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />

                            <input
                                type="password"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />

                            {passwordMessage && <p>{passwordMessage}</p>}

                            <div className="password-modal-buttons">
                                <button
                                    onClick={() => {
                                        setShowPasswordModal(false);
                                        setPasswordMessage("");
                                    }}
                                >
                                    Cancel
                                </button>

                                <button onClick={handleChangePassword}>Update Password</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AccountSettings;