"use client"

import React, { useState, createRef, useEffect, use } from 'react';
import { createNewUser, getCurrentUserGlobal, getUsers, setCurrentUserGlobal } from "../../lib/prisma-commands";
import { motion } from "framer-motion";
import type { User } from "@prisma/client";
import { useRouter } from 'next/navigation';
import { UserAvatar } from './profiles/_components/user-avatar';
import { Button } from '@/components/ui/button';


export default function Home() {


  let router = useRouter();

  function ChooseUser() {

    let [users, setUsers] = useState<User[]>();
    let [isLoading, setIsLoading] = useState(true);


    // fetch the user object from db on start
    useEffect(() => {
      getUsers().then((users) => {
        if (users) {
          setUsers(users);
          console.log(users);
        }
        setIsLoading(false);
      });
    }, [])


    if (!isLoading && users?.length === 1 && users[0].pin !== null) {
      return (
        <main className="flex flex-col items-center justify-center">
          <PinInputReturningUser userPin={users[0].pin} userId={users[0].id} />
        </main>
      )
    }

    if (!isLoading && users && users?.length === 0) {
      return (
        <main className="flex flex-col items-center justify-center">
          <PinInputNewUser />
        </main>
      )
    }

    if (!isLoading && users && users?.length > 1) {
      getCurrentUserGlobal().then((GLOBAL_USER) => {
        if (GLOBAL_USER && GLOBAL_USER?.userId !== -1 && users) {
          for (const user of users) {
            if (user.id === GLOBAL_USER.userId) {
              setUsers([]);
              setUsers([user]);
            }
          }
        } else {
          router.push('/profiles');
        }
      })
    }
  }

  function PinInputNewUser() {
    const pinLength = 4;
    const [pins, setPins] = useState(Array(pinLength).fill(''));
    const inputRefs = Array(pinLength).fill(0).map(() => createRef());

    const handleChange = (value: any, index: number) => {
      const newPins = [...pins];
      newPins[index] = value;
      setPins(newPins);

      if (value.length === 1 && index < pinLength - 1) {
        (inputRefs[index + 1].current as HTMLInputElement).focus();
      }
    };

    const handleBackspace = (event: any, index: number) => {
      if (event.key === 'Backspace' && !pins[index] && index > 0) {
        const newPins = [...pins];
        newPins[index - 1] = '';
        setPins(newPins);
        (inputRefs[index - 1].current as HTMLInputElement).focus();
      }
    };

    useEffect(() => {
      (inputRefs[0].current as HTMLInputElement).focus();
    }, []);

    useEffect(() => {
      if (pins.join('').length === pinLength) {
        createNewUser({ userPin: pins.join('') }).then(() => {
          window.location.reload();
        });
      }

    }, [pins]);

    return (
      <main className="flex flex-col items-center justify-center">
        <motion.h1 className="text-2xl font-medium">Create New Profile</motion.h1>
        <div className="my-4 flex space-x-2">
          {pins.map((pin, index) => (
            <input
              key={index}
              ref={inputRefs[index] as React.RefObject<HTMLInputElement>}
              type="tel" // Use "tel" to get the numeric keyboard on mobile devices
              maxLength={1}
              value={pin}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="h-12 w-12 rounded border-2 border-gray-300 text-center text-xl"
              pattern="[0-9]*" // Ensure only numbers can be inputted
            />
          ))}
        </div>
        <h2 className="text-lg">Enter a <b>pin</b> to protect your account.</h2>
      </main>
    );
  }

  function PinInputReturningUser({ userPin, userId }: { userPin: string, userId: number }) {

    let randomQuotes = [
      "One More Step!",
      "Almost There!",
      "For Your Eyes Only!",
      "Just A Moment!",
      "Not So Fast!",
    ]

    let router = useRouter();

    const pinLength = 4;
    const [pins, setPins] = useState(Array(pinLength).fill(''));
    const inputRefs = Array(pinLength).fill(0).map(() => createRef());
    const [currentUser, setCurrentUser] = useState<User>();

    const handleChange = (value: any, index: number) => {
      const newPins = [...pins];
      newPins[index] = value;
      setPins(newPins);

      if (value.length === 1 && index < pinLength - 1) {
        (inputRefs[index + 1].current as HTMLInputElement).focus();
      }
    };

    const handleBackspace = (event: any, index: number) => {
      if (event.key === 'Backspace' && !pins[index] && index > 0) {
        const newPins = [...pins];
        newPins[index - 1] = '';
        setPins(newPins);
        (inputRefs[index - 1].current as HTMLInputElement).focus();
      }
    };

    useEffect(() => {
      (inputRefs[0].current as HTMLInputElement).focus();
    }, []);

    useEffect(() => {
      if (pins.join('').length === pinLength) {
        if (pins.join('') === userPin) {
          setCurrentUserGlobal({ userId: userId }).then(() => {
            router.push('/dashboard');
          });
        }
      } else if (userPin === "disabled") {
        setCurrentUserGlobal({ userId: userId }).then(() => {
          router.push('/dashboard');
        });
      }

    }, [pins]);

    // get the user object to display the avatar
    useEffect(() => {
      getUsers().then((users) => {
        if (users) {
          for (const user of users) {
            if (user.id === userId) {
              setCurrentUser(user);
            }
          }
        }
      });

    }, [userId]);

    return (
      <main className="mt-3 flex flex-col items-center justify-center">

        <h1 className="select-none text-2xl font-medium">
          {randomQuotes[Math.floor(Math.random() * randomQuotes.length)]}
        </h1>
        {(userId && currentUser) && (
          <div className='mt-2'>
            <UserAvatar userObject={currentUser} />
          </div>
        )}
        <div className="my-4 flex space-x-2">
          {pins.map((pin, index) => (
            <input
              key={index}
              ref={inputRefs[index] as React.RefObject<HTMLInputElement>}
              type="tel" // Use "tel" to get the numeric keyboard on mobile devices
              maxLength={1}
              value={pin}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleBackspace(e, index)}
              className="h-12 w-12 rounded border-2 border-gray-300 text-center text-xl"
              pattern="[0-9]*" // Ensure only numbers can be inputted
            />
          ))}
        </div>
        <h2 className="select-none text-lg">Enter your <b>pin #</b> to get started.</h2>
        <div className='flex w-full flex-row items-center justify-center gap-2'>
          <Button variant="outline" className='mt-2 cursor-pointer text-blue-500 underline underline-offset-2'
            onClick={() => {
              // create db function for resetting pin
            }}
          >Forgot Pin?</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="h-fit w-full p-1 px-2">
      <ChooseUser />
    </main>
  );
}





