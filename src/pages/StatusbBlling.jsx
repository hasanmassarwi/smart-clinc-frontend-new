import React from "react";
import ProtectedLayout from "../components/ProtectedLayout";

export default function StatusBilling () {
  return (
    <ProtectedLayout title="פרטי מטופל">
      <div className="rounded-2xl bg-white p-6 shadow-sm text-right">
       
        <p>כאן יוצגו פרטי הביקור הרפואי עם מזהה .</p>
      </div>
    </ProtectedLayout>
  );
}
