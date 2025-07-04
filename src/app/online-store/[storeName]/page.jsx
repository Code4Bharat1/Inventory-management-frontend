'use client';

import { useParams } from 'next/navigation';
import OnlineStore from '@/components/online-store/onlinestore.jsx';

export default function Page() {
  const params = useParams();  // Get dynamic params from the URL
  const storeName = params.storeName;  // Access storeName from params

  console.log(params);  // Debug to ensure the storeName exists in params

  return (
    <div>
      <h1>Welcome to {storeName}'s Online Store</h1>
      <p>Explore products and enjoy shopping!</p>

      {/* Pass storeName as prop */}
      <OnlineStore storeName={storeName} />
    </div>
  );
}
