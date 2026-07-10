"use client";

import React, { useState } from "react";

interface PasswordChangeFormProps {
  userId?: string;
  onSuccess?: () => void;
  className?: string;
}

export const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({
  userId,
  onSuccess,
  className = "",
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
    if (!/\d/.test(password)) return "Password must contain at least one number";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    const validationError = validatePassword(newPassword);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          currentPassword,
          newPassword,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to change password");
      }

      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className={`p-4 bg-green-900/20 border border-green-500/50 rounded ${className}`}>
        <div className="font-pixel text-xs text-green-400 mb-2">
          Password changed successfully!
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white font-pixel text-xs rounded transition-colors"
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <h3 className="font-pixel text-sm text-white mb-3">Change Password</h3>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors"
            required
          />
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors"
            required
          />
          <div className="font-pixel text-xs text-gray-500 mt-1">
            Min 8 chars, 1 uppercase, 1 lowercase, 1 number
          </div>
        </div>

        <div>
          <label className="font-pixel text-xs text-gray-400 block mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="retro-textarea w-full px-3 py-2 bg-gray-800/30 border border-gray-700/50 rounded focus:outline-none focus:border-blue-500/50 transition-colors"
            required
          />
        </div>

        {error && (
          <div className="p-2 bg-red-500/10 border border-red-500/20 rounded">
            <p className="font-pixel text-xs text-red-400">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
          className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-pixel text-xs rounded transition-colors"
        >
          {isLoading ? "Changing Password..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default PasswordChangeForm;