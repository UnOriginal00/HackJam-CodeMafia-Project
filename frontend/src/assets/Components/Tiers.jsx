import React from 'react';
import SharedHeader from './SharedHeader';
import { CreditCard, Sparkles } from 'lucide-react';

export default function Tiers() {
  return (
    <div>
      <SharedHeader title="Plans & Tiers" />
      <div className="max-w-[1200px] mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Choose your plan</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
          {/* Free tier card - taller and wider with centered content */}
          <div className="bg-white rounded-lg shadow-md p-8 flex flex-col justify-between items-center text-center h-[40rem] w-72 sm:w-80 md:w-96 lg:w-[28rem]">
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-md bg-gray-200 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <div className="text-2xl font-bold">Free</div>
                <div className="text-base text-gray-500">Get started with the core features</div>
              </div>

              <ul className="mt-4 space-y-3 text-lg text-gray-700 list-disc list-inside">
                <li>Innovation suite access</li>
                <li>MyDesk</li>
                <li>Limited AI prompts</li>
                <li>Resource storage</li>
                <li>Limited groups</li>
              </ul>
            </div>

            <div className="mt-6 w-full">
              <button className="w-full px-6 py-3 rounded-md bg-white border border-gray-300 text-gray-800 text-lg">Current plan</button>
            </div>
          </div>

          {/* Premium tier card - taller and wider with centered content */}
          <div className="bg-gradient-to-r from-orange-400 to-purple-500 rounded-lg shadow-md p-8 flex flex-col justify-between items-center text-center h-[40rem] w-72 sm:w-80 md:w-96 lg:w-[28rem] text-white">
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 rounded-md bg-white/20 flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">Premium</div>
                <div className="text-base opacity-90">Unlock everything — no limits</div>
              </div>

              <ul className="mt-4 space-y-3 text-lg opacity-95 list-disc list-inside">
                <li>Everything from Free tier</li>
                <li>Unlimited groups</li>
                <li>Unlimited AI prompts</li>
                <li>Personalisation</li>
                <li>First in line for new features</li>
              </ul>
            </div>

            <div className="mt-6 w-full">
              <button className="w-full px-6 py-3 rounded-md bg-white text-purple-600 font-semibold text-lg">Upgrade to Premium</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
