"use client"

import { Button } from '@/components/ui/button'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { open } from '@tauri-apps/api/dialog';
import { addFolder, closeDatabase, deleteFolder, getCurrentUserGlobal, getFolders, getUserScrollY, getUserSettings, getUsers, getVideo, unwatchVideo, updateFolderExpanded, updateUserScrollY, updateVideoWatched, userGetAllVideos } from '../../../lib/prisma-commands';
import type { Folder as PrismaFolder, User, Video } from "@prisma/client";
import { Captions, ChevronDown, ChevronUp, CornerLeftDown, Eye, EyeOff, Film, Folder, FolderInput, FolderPlus, Folders, Trash2, VideoIcon, } from 'lucide-react';
import { FileEntry, readDir } from '@tauri-apps/api/fs'
import { cn } from '@/lib/utils';
import { invoke } from '@tauri-apps/api/tauri';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { SettingSchema } from '../settings/page';
import { ContextMenuSeparator, ContextMenuSub, ContextMenuSubContent } from '@radix-ui/react-context-menu';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';
import { number, set, string } from 'zod';
import { finished } from 'stream';
import FolderList from './_components/folder-list';
// import { WebviewWindow, appWindow } from "@tauri-apps/api/window"


export default function Dashboard() {
    const [folderPaths, setFolderPaths] = useState<string[]>([]);
    const [parentFolderPaths, setParentFolderPaths] = useState<string[]>([]);
    const [currentUser, setCurrentUser] = useState<User>();
    const [userSettings, setUserSettings] = useState<SettingSchema>();
    const scrolledDiv = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    //const { scrollYProgress } = useScroll();
    const router = useRouter();
    const { scrollY } = useScroll({
        container: scrolledDiv
    })

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (currentUser && latest > 0)
            updateUserScrollY({ userId: currentUser?.id, scrollY: latest });
    })

    const setScrollPosition = (userYPos: any) => {
        (scrolledDiv.current as HTMLElement | null)?.scrollTo({
            top: userYPos,
            behavior: "smooth"
        });
    };

    const calculateDelay = (userY: any) => {
        let numberY = Number(userY);
        //console.log("userY: ", userY);
        // Base delay
        const baseDelay = 100;

        // Additional delay per 1000 pixels
        let delayPerThousandPixels = 0;

        if (numberY > 5000) {
            delayPerThousandPixels = 40;
        } else if (numberY > 10000) {
            delayPerThousandPixels = 60;
        } else if (numberY > 15000) {
            delayPerThousandPixels = 70;
        } else if (numberY > 30000) {
            delayPerThousandPixels = 100;
        } else {
            delayPerThousandPixels = 20;
        }


        // Calculate additional delay based on userY
        const additionalDelay = Math.floor(userY / 1000) * delayPerThousandPixels;

        // Total delay is the sum of the base delay and the additional delay
        return baseDelay + additionalDelay;
    };

    // fetch the user object from db on start and set the current user
    useEffect(() => {
        // first close the db
        closeDatabase().then(() => {
            getUsers().then((users) => {
                if (users?.length !== 0 && users) {
                    getCurrentUserGlobal().then((GLOBAL_USER) => {
                        if (GLOBAL_USER && GLOBAL_USER?.userId !== -1) {
                            for (const user of users) {
                                if (user.id === Number(GLOBAL_USER?.userId)) {
                                    setCurrentUser(user);
                                    break;
                                }
                            }
                        } else {
                            //router.prefetch('/');
                            closeDatabase().then(() => {
                                router.push('/', { scroll: false });
                            });

                        }
                    });
                } else {
                    closeDatabase().then(() => {
                        router.push('/profiles/createUser', { scroll: false });
                    });
                }
            })
        });

    }, [router]);

    // get and set the user's scroll position from the db once currentUser is set
    useEffect(() => {
        if (scrolledDiv.current) { // dont let the user be able to scroll while its loadinh
            scrolledDiv.current.style.maxHeight = "0px";
        }
        if (currentUser && !isLoading)
            getUserScrollY({ userId: currentUser?.id }).then((userY: any) => {
                let unlisten: NodeJS.Timeout;
                if (userY !== 0 && userY !== null && userY !== undefined) {
                    //console.log("User scroll: ", userY)

                    // TODO : This should to be changed but it works fine. Position should be referenced to an element somehow instead of a debounce. 

                    if (scrolledDiv.current) {
                        unlisten = setTimeout(() => {
                            if (userY > 0 && userY !== null && userY !== undefined)
                                setScrollPosition(userY);
                            if (scrolledDiv.current)
                                if (scrolledDiv.current) {
                                    scrolledDiv.current.style.maxHeight = "100vh";
                                }
                            //console.log("scrolling to ", userY);
                        }, calculateDelay(userY));
                    }

                }

                return () => {
                    clearTimeout(unlisten);
                }

            })
    }, [currentUser, isLoading]);

    // get all the folder paths from the folder table with user id on startup
    useEffect(() => {
        setIsLoading(true);
        //console.log(currentUser);
        if (currentUser?.id)
            getFolders({ userId: currentUser?.id as number }).then((folders) => {
                if (folders) {
                    //console.log(`folders for user ${currentUser?.id} `, folders);
                    for (const folder of folders) {
                        if (!folder.asChild) {
                            setFolderPaths((prev) => [...prev, folder.path]);
                        }
                    }
                }
            }).finally(() => {
                //console.log(`parent folder paths: ${folderPaths}`);
                if (currentUser?.id) {
                    getUserSettings({ userId: currentUser?.id }).then((settings) => {
                        if (settings) {
                            //console.log("user settings:", settings);
                            setUserSettings(settings);
                        }
                    })
                }
                setIsLoading(false);
            })

    }, [currentUser])

    const setFolderPathsHook = (newPaths: string[]) => {
        setFolderPaths(newPaths);
    }

    const setParentFolderPathsHook = (newPaths: string[]) => {
        setParentFolderPaths(newPaths);
    };

    return (
        <main className={cn('pl-3 lg:px-16 xl:px-36 2xl:px-48 mt-3 max-h-screen overflow-auto pb-5',
        )}
            ref={scrolledDiv}
            style={{ scrollbarGutter: "stable", }}
        >
            {/* Render Top-Level-Parent Folders */}
            <motion.div className='mb-16 flex h-full w-full flex-col items-center justify-center gap-2 rounded-b-sm drop-shadow-sm'
                key={"main-parent-folder" + folderPaths.length + 1}
            >
                {folderPaths.map((folder, index) => {
                    return (
                        <FolderList folderPath={folder} userSettings={userSettings} currentUser={currentUser} folderPaths={folderPaths} parentFolderPaths={parentFolderPaths} setFolderPathsHook={setFolderPathsHook} setParentFolderPathsHook={setParentFolderPathsHook} key={index.toString() + folder} />
                    )
                })}
                <AnimatePresence>
                    {/* Add Folder Button */}
                    {userSettings && (
                        <motion.div className='flex h-full w-full flex-col items-start justify-center'
                            initial={userSettings?.animations === "On" ? { opacity: 0 } : undefined}
                            animate={userSettings?.animations === "On" ? { opacity: 1 } : undefined}
                            exit={userSettings?.animations === "On" ? { opacity: 0 } : undefined}
                            transition={userSettings?.animations === "On" ? { duration: 0.2, damping: 5 } : undefined}
                            key={"Add-Folder-Button"}
                        >
                            <Button variant="outline"
                                className={cn('select-none flex flex-row justify-center items-end gap-1.5 font-bold',
                                    userSettings?.fontSize === "Medium" && 'text-lg mx-0',
                                    userSettings?.fontSize === "Large" && 'text-xl mx-0',
                                    userSettings?.fontSize === "XLarge" && 'text-2xl mx-0',
                                )}
                                onClick={() => {
                                    open({
                                        directory: true,
                                        multiple: true,
                                        recursive: true,
                                        filters: [
                                            { name: 'Folders', extensions: [""] }
                                        ],
                                        title: "Add Folder"
                                    }).then((selectedFolders): void => {
                                        if (currentUser) {
                                            if (Array.isArray(selectedFolders)) {
                                                // user selected multiple files
                                                for (const path of selectedFolders) {
                                                    if (folderPaths.some((folderPath) => folderPath.toString() === path)) {
                                                        let pathName = path.replaceAll("\\", " ").split(" ").pop();
                                                        toast({
                                                            title: `${pathName} already exists!`,
                                                            description: `You already have a folder with the name ${pathName} in your library.`,
                                                            duration: 2000,
                                                        })
                                                        return
                                                    } else {
                                                        addFolder({ userId: currentUser?.id, folderPath: path, expanded: false, asChild: false }).then(() => {
                                                            setFolderPaths(prevPaths => [...prevPaths, path] as string[]);
                                                        });
                                                    }

                                                }

                                            } else if (selectedFolders === null) {
                                                // cancalled //.. do nothing
                                            } else {
                                                if (folderPaths.filter((folderPath) => folderPath === selectedFolders)) {
                                                    let pathName = selectedFolders.replaceAll("\\", " ").split(" ").pop();
                                                    toast({
                                                        title: `${pathName} already exists!`,
                                                        description: `You already have a folder with the name ${pathName} in your library.`,
                                                        duration: 2000,
                                                    })
                                                    // user selected one folder
                                                    addFolder({ userId: currentUser?.id, folderPath: selectedFolders.toString(), expanded: false, asChild: false }).then(() => {
                                                        setFolderPaths(prevPaths => [...prevPaths, selectedFolders] as string[]);
                                                    });
                                                }
                                            }





                                        }
                                    })
                                }}
                            >
                                <span>Add Folder</span>
                                <FolderPlus className={cn('h-auto w-4',
                                    userSettings?.fontSize === "Medium" && 'h-auto w-5',
                                    userSettings?.fontSize === "Large" && 'h-auto w-6',
                                    userSettings?.fontSize === "XLarge" && 'h-auto w-7'
                                )} />

                            </Button>

                        </motion.div>
                    )}
                    {/* Add Folder Button */}
                </AnimatePresence>
            </motion.div >

        </main >
    )

}


