import { supabase } from "./supabase.js";

/* =========================
   EMAIL SIGN UP
========================= */
export async function signUpWithEmail(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("Signup successful! Please verify your email.");
  return data;
}

/* =========================
   EMAIL LOGIN
========================= */
export async function loginWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "dashboard.html";
}

/* =========================
   MOBILE OTP SIGN UP / LOGIN
========================= */
export async function sendOtp(phone) {
  const { error } = await supabase.auth.signInWithOtp({
    phone
  });

  if (error) {
    alert(error.message);
    return;
  }

  alert("OTP sent to your mobile number");
}

export async function verifyOtp(phone, otp) {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token: otp,
    type: "sms"
  });

  if (error) {
    alert(error.message);
    return;
  }

  window.location.href = "dashboard.html";
}

/* =========================
   LOGOUT
========================= */
export async function logout() {
  await supabase.auth.signOut();
  window.location.href = "index.html";
}

/* =========================
   GET CURRENT USER
========================= */
export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
