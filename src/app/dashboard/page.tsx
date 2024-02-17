"use client"

import { Button } from '@/components/ui/button'
import React, { use, useEffect, useState } from 'react'
import { open } from '@tauri-apps/api/dialog';
import { addFolder, deleteFolder, getFolders, getUsers, getVideo, unwatchVideo, updateVideoWatched } from '../../../lib/prisma-commands';
import type { User, Video } from "@prisma/client";
import { Captions, Eye, FileVideo, Film, Folder, Loader, Play, PlayCircle, Trash2 } from 'lucide-react';
import { FileEntry, readDir } from '@tauri-apps/api/fs'
import { cn } from '@/lib/utils';
import { invoke } from '@tauri-apps/api/tauri';
import { MotionConfig, motion } from 'framer-motion';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { SettingSchema } from '../settings/page';



export default function Dashboard() {
    let [folderPaths, setFolderPaths] = useState<string[]>([]);
    let [currentUser, setCurrentUser] = useState<User>();

    // fetch the user object from db on start
    useEffect(() => {
        getUsers().then((users) => {
            if (users) {
                let id = localStorage.getItem('userID');
                if (id) {
                    for (const user of users) {
                        if (user.id === Number(id)) {
                            setCurrentUser(user);
                            break;
                        }
                    }
                }
            }
        })

    }, [])

    // get all the folder paths from the folder table with user id on startup
    useEffect(() => {
        console.log(currentUser);

        getFolders({ userId: currentUser?.id as number }).then((folders) => {
            if (folders) {
                setFolderPaths(folders.map(folder => folder.path));
            }
        });

    }, [currentUser])


    function AddFolder(
    ) {
        return (
            <main
            >
                <Button variant="outline"
                    onClick={() => {
                        open({
                            directory: true
                        }).then((res): void => {
                            if (res && currentUser) {
                                addFolder({ userId: currentUser?.id, folderPath: res.toString() });
                                setFolderPaths(prevPaths => [...prevPaths, res] as string[]);
                            }
                        })
                    }}
                >
                    Add Folder
                </Button>
            </main>
        )
    }

    function FolderList({ folderPath, asChild }: { folderPath: string, asChild?: boolean | undefined }) {

        let [files, setFiles] = useState<FileEntry[]>([]);
        let [folders, setFolders] = useState<FileEntry[]>([]);
        let [expanded, setExpanded] = useState(false);
        let [subtitleFiles, setSubtitleFiles] = useState<FileEntry[]>([]);
        let [deleting, setDeleting] = useState(false);
        let [prismaVideos, setPrismaVideos] = useState<Video[]>([]);
        let [finishedSettingFiles, setFinishedSettingFiles] = useState(false);
        let [userSettings, setUserSettings] = useState<SettingSchema>();

        // get all the files and folders in the folder path on startup
        useEffect(() => {
            readDir(folderPath).then((res) => {
                if (res) {
                    let videoFiles = res.filter(file => {
                        let ext = file.path.split('.').pop();
                        if (ext) {
                            return supportedVideoFormats.includes(ext);
                        }
                        return false;
                    })

                    let subtitleFiles = res.filter(file => {
                        let ext = file.path.split('.').pop();
                        if (ext) {
                            return ext === 'srt';
                        }
                        return false;
                    })

                    let folders = res.filter(file => {
                        if (file.children) {
                            return file.name;
                        }
                    });
                    //console.log("folders:", folders);

                    setFiles(videoFiles);
                    setFolders(folders);
                    setSubtitleFiles(subtitleFiles);
                    setFinishedSettingFiles(true);
                }

            })
        }, [])

        // get all the videos from the db on startup
        useEffect(() => {
            setPrismaVideos([]);
            if (currentUser && files.length > 0) {
                setPrismaVideos([]);
                for (const file of files) {
                    getVideo({ videoPath: file.path }).then((video) => {
                        if (video) {
                            setPrismaVideos(prevVideos => [...prevVideos, video]);
                            //console.log(prismaVideos);
                        }
                    })
                }
            }
        }, [finishedSettingFiles])

        // grabs the users settings from the db on startup
        useEffect(() => {

        }, [])

        if (!deleting) {
            return (
                <main className='h-full w-full overflow-hidden'>
                    <MotionConfig reducedMotion={userSettings?.animations === "On" ? 'always' : 'never'} >
                        <ContextMenu>
                            <ContextMenuTrigger>
                                <motion.div className={cn('flex cursor-pointer flex-row items-center justify-between rounded-md bg-accent p-1 shadow-sm',
                                    (expanded && files.length > 0 && !asChild) && 'rounded-b-none border-b-4 border-tertiary',
                                    (expanded && folders.length > 0 && !asChild) && 'rounded-b-none border-b-4 border-tertiary',
                                    (asChild && expanded) && ' px-1 border-none my-1.5'
                                )}
                                    onClick={(e) => {
                                        if (e.button === 0)
                                            setExpanded(!expanded);
                                    }}
                                    whileHover={{ scale: 0.99 }}
                                    transition={{ duration: 0.15 }}

                                >
                                    <div className={cn('flex flex-row items-center justify-center gap-1 font-medium text-primary',
                                    )}>
                                        {asChild && <Folder />}
                                        {folders.length === 0 && files.length === 0 && subtitleFiles.length === 0 ?
                                            <span className={cn('line-through',
                                                userSettings?.fontSize === "Medium" && 'text-lg',
                                                userSettings?.fontSize === "Large" && 'text-xl',
                                                userSettings?.fontSize === "XLarge" && 'text-2xl',
                                            )}>{folderPath.replace(/\\/g, '/').split('/').pop()}
                                            </span>

                                            : (
                                                <span className={cn('',
                                                    userSettings?.fontSize === "Medium" && 'text-lg',
                                                    userSettings?.fontSize === "Large" && 'text-xl',
                                                    userSettings?.fontSize === "XLarge" && 'text-2xl',
                                                )}>
                                                    {folderPath.replace(/\\/g, '/').split('/').pop()}
                                                </span>
                                            )}
                                        {folders.length > 0 && (
                                            <div className='flex flex-row items-center justify-center gap-0.5 rounded-md bg-tertiary px-0.5 py-0.5'>
                                                <Folder className={cn('h-auto w-4',
                                                    userSettings?.fontSize === "Medium" && 'h-auto w-5',
                                                    userSettings?.fontSize === "Large" && 'h-auto w-7',
                                                    userSettings?.fontSize === "XLarge" && 'h-auto w-9'
                                                )}

                                                />
                                                {folders.length > 0 && folders.length}
                                            </div>
                                        )}
                                        {files.length > 0 && (
                                            <div className={cn('flex flex-row items-center justify-center text-sm rounded-md bg-tertiary px-0.5 py-0.5',
                                                userSettings?.fontSize === "Medium" && 'text-base',
                                                userSettings?.fontSize === "Large" && 'text-lg',
                                                userSettings?.fontSize === "XLarge" && 'text-xl',

                                            )}>
                                                <FileVideo className={cn('h-auto w-4',
                                                    userSettings?.fontSize === "Medium" && 'h-auto w-5',
                                                    userSettings?.fontSize === "Large" && 'h-auto w-7',
                                                    userSettings?.fontSize === "XLarge" && 'h-auto w-9'
                                                )}

                                                />
                                                {files.length}
                                            </div>
                                        )}
                                        {subtitleFiles.length > 0 && (
                                            <div className={cn('flex flex-row items-center justify-center text-sm rounded-md bg-tertiary px-0.5 py-0.5',
                                                userSettings?.fontSize === "Medium" && 'text-base',
                                                userSettings?.fontSize === "Large" && 'text-lg',
                                                userSettings?.fontSize === "XLarge" && 'text-xl',

                                            )}>
                                                <Captions className={cn('h-auto w-4',
                                                    userSettings?.fontSize === "Medium" && 'h-auto w-5',
                                                    userSettings?.fontSize === "Large" && 'h-auto w-7',
                                                    userSettings?.fontSize === "XLarge" && 'h-auto w-9'
                                                )}

                                                />
                                                {subtitleFiles.length}
                                            </div>
                                        )}


                                    </div>
                                    {asChild !== true && (
                                        <motion.span
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className=''
                                        >
                                            <Trash2 className={cn('rounded-lg p-0.5 text-destructive hover:bg-white h-auto w-6',
                                                userSettings?.fontSize === "Medium" && 'h-auto w-7',
                                                userSettings?.fontSize === "Large" && 'h-auto w-8',
                                                userSettings?.fontSize === "XLarge" && 'h-auto w-9'
                                            )} onClick={(e) => {
                                                e.stopPropagation();
                                                setDeleting(true);
                                                // trigger the delete folder db command
                                                deleteFolder({ folderPath }).then(() => {
                                                    window.location.reload();
                                                });
                                            }} />

                                        </motion.span>
                                    )}
                                </motion.div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem className='cursor-pointer'
                                    onClick={(e) => {
                                        if (e.button === 0) {
                                            invoke('show_in_folder', { path: `${folderPath}` });
                                        }
                                    }}
                                >
                                    Open In File Explorer
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>

                        <ul className='overflow-hidden overflow-y-auto bg-muted'>
                            {
                                expanded && files.map((file, index) => {
                                    return (
                                        <motion.li className={cn('flex flex-col items-start justify-center gap-1 border-b-2 p-0.5 px-4 cursor-pointer overflow-hidden',
                                            (index === files.length - 1 && !asChild) && 'rounded-b-md border-b-4 border-tertiary',
                                        )}
                                            onClick={() => {
                                                // open the file in the default video player
                                                invoke('open_video', { path: file.path });

                                                // update the video as watched in the db
                                                updateVideoWatched({ videoPath: file.path }).then(() => {
                                                    setFinishedSettingFiles(!finishedSettingFiles);
                                                });
                                            }}
                                            key={index}

                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            whileHover={{ x: 10 }}
                                        >
                                            {!file.children &&
                                                <div className='flex flex-row items-center justify-center gap-1'>
                                                    <Film className={cn('h-auto w-4',
                                                        userSettings?.fontSize === "Medium" && 'h-auto w-5',
                                                        userSettings?.fontSize === "Large" && 'h-auto w-7',
                                                        userSettings?.fontSize === "XLarge" && 'h-auto w-9'
                                                    )}

                                                    />
                                                    {/* Check if the file's path matches any video's path in prismaVideos */}
                                                    {prismaVideos.some(video => video.path === file.path && video.watched) ? (
                                                        <div className='flex flex-row items-center justify-center gap-1 rounded-sm px-0.5 font-medium'>
                                                            <motion.div
                                                                whileHover={{ scale: 1.2 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                onClick={(e) => {
                                                                    // set the video as unwatched when the user clicks on the eye icon
                                                                    e.stopPropagation();
                                                                    unwatchVideo({ videoPath: file.path }).then(() => {
                                                                        setFinishedSettingFiles(!finishedSettingFiles);
                                                                    });
                                                                }}
                                                            >
                                                                <Eye className={cn('h-auto w-4',
                                                                    userSettings?.fontSize === "Medium" && 'h-auto w-5',
                                                                    userSettings?.fontSize === "Large" && 'h-auto w-7',
                                                                    userSettings?.fontSize === "XLarge" && 'h-auto w-9'
                                                                )}

                                                                />
                                                            </motion.div>
                                                            <span className={cn('text-sm',
                                                                userSettings?.fontSize === "Medium" && 'text-base',
                                                                userSettings?.fontSize === "Large" && 'text-lg',
                                                                userSettings?.fontSize === "XLarge" && 'text-xl',
                                                            )}>
                                                                {file.name}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className={cn('text-sm',
                                                            userSettings?.fontSize === "Medium" && 'text-base',
                                                            userSettings?.fontSize === "Large" && 'text-lg',
                                                            userSettings?.fontSize === "XLarge" && 'text-xl',
                                                        )}>{file.name}</span>
                                                    )}
                                                </div>
                                            }
                                        </motion.li>

                                    )
                                })
                            }
                            {
                                expanded && folders.map((folder, index) => {
                                    return (
                                        <motion.li className={cn('flex flex-col items-start justify-center gap-1 border-b-2 p-0.5 px-2 cursor-pointer overflow-hidden',
                                            (index === files.length - 1 && !asChild) && 'rounded-b-md border-b-4 border-tertiary',
                                            (index === folders.length - 1 && !asChild) && 'rounded-b-md border-b-4 border-tertiary',
                                            asChild && 'px-3.5 border-none my-1',
                                        )}
                                            key={index}

                                            initial={{ scale: 0.8 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            whileHover={{ x: 10 }}
                                        >

                                            <FolderList folderPath={folder.path} asChild />

                                        </motion.li>

                                    )
                                })
                            }
                        </ul>
                    </MotionConfig>
                </main>
            )
        } else {
            return (
                <Loader className='animate-spin' />
            )
        }
    }

    if (currentUser) {
        return (
            <main className='flex h-fit w-full flex-col gap-2 p-3'>
                {folderPaths.map((folder, index) => {
                    return <FolderList folderPath={folder} key={index} />
                })}

                <AddFolder />
            </main>
        )
    } else {
        return (
            <main className='flex h-1/2 w-full flex-row items-center justify-center'>
                <Loader className='animate-spin' size={40} />
            </main>
        )
    }
}

let supportedVideoFormats = ['mp4', 'mkv', 'avi', 'mov', 'wmv', 'flv', 'webm', 'vob', 'ogv', 'ogg', 'drc', 'gif', 'gifv', 'mng', 'avi', 'mov', 'qt', 'wmv', 'yuv', 'rm', 'rmvb', 'asf', 'amv', 'mp4', 'm4p', 'm4v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mpg', 'mpeg', 'm2v', 'm4v', 'svi', '3gp', '3g2', 'mxf', 'roq', 'nsv', 'flv', 'f4v', 'f4p', 'f4a', 'f4b'];