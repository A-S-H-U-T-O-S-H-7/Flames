import React from 'react';
import Form from '@/components/Admin/admins/Form';
import ListView from '@/components/Admin/admins/ListView';

export default function Page() {
  return (
    <div className="p-5">
      <main className="flex flex-1 flex-col md:flex-row gap-5 w-full">
        <div className="w-full ">
          <Form />
        </div>
        <div className="w-full ">
          <ListView />
        </div>
      </main>
    </div>
  );
}