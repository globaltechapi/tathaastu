import { supabase } from "./supabase";

// Check if a user is a brand ambassador
export const checkBrandAmbassadorStatus = async (
  userId: string,
): Promise<boolean> => {
  try {
    console.log("Checking brand ambassador status for user ID:", userId);

    const { data, error } = await supabase
      .from("brand_ambassadors")
      .select("id, status")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Error checking brand ambassador status:", error);
      return false;
    }

    const isAmbassador = data && data.status === "active";
    console.log("Is ambassador result:", isAmbassador, "Data:", data);
    return isAmbassador;
  } catch (error) {
    console.error("Error checking brand ambassador status:", error);
    return false;
  }
};

// Create a brand ambassador record after payment
export const createBrandAmbassador = async (
  userId: string,
  paymentId: string,
  userData: any,
): Promise<boolean> => {
  try {
    const { error } = await supabase.from("brand_ambassadors").insert([
      {
        user_id: userId,
        payment_id: paymentId,
        status: "active",
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        state: userData.state,
        pincode: userData.pincode,
        tshirt_size: userData.tshirtSize,
        kit_status: "processing",
        joined_date: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error creating brand ambassador:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error creating brand ambassador:", error);
    return false;
  }
};
