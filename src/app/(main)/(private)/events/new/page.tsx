import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";

const NewEvents = () => {
  return (
    <div className="py-35  flex flex-col items-center w-full border-2 h-screen ">
      <Card className="w-full border-0 shadow-[0_0_12px_0_rgba(0,0,0,0.15)]">
        <CardHeader className="w-full text-center">
          <CardTitle className="tracking-wider capitalize border-b-2 border-gray-300 py-3">
            Create New Event
          </CardTitle>
        </CardHeader>

        <CardContent>asdasd</CardContent>
      </Card>
    </div>
  );
};

export default NewEvents;
