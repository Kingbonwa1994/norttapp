'use client';

import { useState } from 'react';
import { Tab } from '@headlessui/react';
import UsersTable from './UsersTable';
import SongsTable from './SongsTable';
import ReelsTable from './ReelsTable';
import StationsTable from './StationsTable';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminTabs() {
  const tabs = [
    { name: 'Users', component: UsersTable },
    { name: 'Songs', component: SongsTable },
    { name: 'Reels', component: ReelsTable },
    { name: 'Stations', component: StationsTable },
  ];

  return (
    <div className="w-full px-2 py-16 sm:px-0">
      <Tab.Group>
        <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.name}
              className={({ selected }) =>
                classNames(
                  'w-full rounded-lg py-2.5 text-sm font-medium leading-5',
                  'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                  selected
                    ? 'bg-white shadow text-blue-700'
                    : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                )
              }
            >
              {tab.name}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-2">
          {tabs.map((tab, idx) => (
            <Tab.Panel
              key={idx}
              className={classNames(
                'rounded-xl bg-white p-3',
                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2'
              )}
            >
              <tab.component />
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}