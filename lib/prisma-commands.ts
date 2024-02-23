import Database from "tauri-plugin-sql-api"
import { User, Folder, Video } from "@prisma/client";
import { SettingSchema } from "@/app/settings/page";
import { Global } from "@prisma/client";
import { convertFileSrc, invoke } from '@tauri-apps/api/tauri';
// import { WebviewWindow } from "@tauri-apps/api/window";

export async function getUsers() {
    const db = await Database.load("sqlite:main.db");

    await db.execute(
        `CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            pin TEXT NOT NULL, 
            imagePath TEXT,
            color TEXT  
        )`
    )

    let users: User[] = [];

    try {
        users = await db.select(
            "SELECT * from user"
        )
    } catch (e) {
        console.log(e);
    }

    if (users.length !== 0) {
        console.log("confirmed users", users);
        return users;
    } else {
        //console.log("users", users);
        return null;
    }


}

export async function createNewUser({
    userPin,
    formData,
}: {
    userPin: string,
    formData: SettingSchema,
}) {
    let db = await Database.load("sqlite:main.db");

    console.log("Creating User With Pin", userPin);

    try {
        await db.execute(`BEGIN TRANSACTION;`);

        // Ensure the table exists before attempting to insert into it
        await db.execute(`
        CREATE TABLE IF NOT EXISTS user 
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pin TEXT NOT NULL,
            imagePath TEXT,
            color TEXT UNIQUE )`
        )

        await db.execute(`
        CREATE TABLE IF NOT EXISTS settings 
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL UNIQUE, 
            theme TEXT NOT NULL, 
            fontSize TEXT NOT NULL, 
            animations TEXT NOT NULL, 
            autoRename TEXT NOT NULL, 
            usePin TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES user(id))`
        )


        // Attempt to insert a new user with a color if provided
        // This assumes you want to insert the color only if it doesn't already exist in the table
        // If the color is not provided or is an empty string, this will skip the attempt to insert the color

        await invoke("generate_random_color").then(async (color) => {
            await db.execute(`INSERT OR IGNORE INTO user (pin, color) VALUES ($1, $2)`, [userPin, color])
        });

        await db.execute("COMMIT;")

    } catch (e) {
        console.log(e);
        await db.execute("ROLLBACK;");
    }

    await db.select("SELECT * from user WHERE pin = $1", [userPin]).then(async (user: any) => {

        if (user.length !== 0) {
            console.log("Found user from pin", user);
            await db.execute(`
        INSERT INTO settings 
        (
            userId, theme, fontSize, animations, autoRename, usePin
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT(userId) DO UPDATE SET
            theme = excluded.theme,
            fontSize = excluded.fontSize,
            animations = excluded.animations,
            autoRename = excluded.autoRename,
            usePin = excluded.usePin`,
                [user[0].id, formData.theme, formData.fontSize, formData.animations, formData.autoRename, formData.usePin]).catch((e) => {
                    console.log("error", e);
                });

            await db.close();
            return user[0].id;
        }
    }).catch((e) => {
        console.log(e);
        return false
    });




}

export async function addFolder({
    userId,
    folderPath
}: {
    userId: number,
    folderPath: string
}) {
    let db = await Database.load("sqlite:main.db");

    await db.execute("CREATE TABLE IF NOT EXISTS folder (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, path TEXT NOT NULL, FOREIGN KEY (userId) REFERENCES user(id))")

    await db.execute("INSERT into folder (userId, path) VALUES ($1, $2)", [userId, folderPath])

        ;
}

export async function getFolders({
    userId
}: {
    userId: number
}) {
    let db = await Database.load("sqlite:main.db");

    console.log("userId", userId);

    try {
        await db.execute("CREATE TABLE IF NOT EXISTS folder (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL, path TEXT NOT NULL, FOREIGN KEY (userId) REFERENCES user(id))")
        // Directly return the result of the query
        let folders: Folder[] = await db.select("SELECT * from folder WHERE userId = $1", [userId]);
        //console.log("folders", folders);
        if (folders.length !== 0) {
            console.log("folders", folders);
            return folders;
        } else {
            return folders;
        }

    } catch (e) {
        console.log(e);
        // Return an empty array or handle the error as needed
        ;
        return [];
    }

}

export async function deleteFolder({
    folderPath,
}: {
    folderPath: string

}) {
    let db = await Database.load("sqlite:main.db");

    await db.execute("DELETE from folder WHERE path = $1", [folderPath])

        ;
}

export async function updateVideoWatched({
    videoPath,
    user,
    watched
}: {
    videoPath: string,
    user: User,
    watched: boolean
}) {
    console.log("Updating: ", videoPath);

    let db = await Database.load("sqlite:main.db");

    try {

        // Ensure the video table exists with the correct schema including the userId field
        await db.execute(`
            CREATE TABLE IF NOT EXISTS video (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                path TEXT NOT NULL UNIQUE, 
                watched BOOLEAN NOT NULL DEFAULT 0,
                userId INTEGER,
                FOREIGN KEY (userId) REFERENCES user(id)
            )
        `);

        // Check if the video already exists in the database
        const videos: Video[] = await db.select("SELECT * FROM video WHERE path = $1", [videoPath]);

        if (videos.length === 0) {
            // Insert new video record if it does not exist
            await db.execute("INSERT INTO video (path, watched, userId) VALUES ($1, $2, $3)", [videoPath, watched ? 1 : 0, user.id]);
        } else {
            // Update existing video record
            await db.execute("UPDATE video SET watched = $2 WHERE path = $1", [videoPath, watched ? 1 : 0]);
        }

    } catch (e) {
        console.error(e); // Better error handling could be implemented here
        return false
    }

    await db.close();
    return true;
}


export async function getVideo({
    videoPath,
}: {
    videoPath: string,
}) {
    let db = await Database.load("sqlite:main.db");

    let video: any;

    try {
        await db.execute(`
        CREATE TABLE IF NOT EXISTS video (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            path TEXT NOT NULL UNIQUE, 
            watched BOOLEAN NOT NULL DEFAULT 0,
            userId INTEGER, 
            FOREIGN KEY (userId) REFERENCES user(id)
        )`
        )

        video = await db.select("SELECT * from video WHERE path = ($1)", [videoPath])

        //;
    } catch (e) {
        console.log(e);

    }

    if (video && video.length !== 0) {
        //console.log("video", video);
        return video[0];
    } else {
        return null
    }
}

export async function unwatchVideo({
    videoPath,
}: {
    videoPath: string,
}) {
    let db = await Database.load("sqlite:main.db");

    console.log("videoPath", videoPath);

    await db.execute("UPDATE video SET watched = 0 WHERE path = ($1)", [videoPath]).catch((e) => {
        console.log("error", e);
    });


    return true;
}

export async function updateSettings({
    formData,
    userId
}: {
    formData: SettingSchema
    userId: number
}) {
    const db = await Database.load("sqlite:main.db");

    //console.log("formData", formData);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL UNIQUE, 
    theme TEXT NOT NULL, 
    fontSize TEXT NOT NULL, 
    animations TEXT NOT NULL, 
    autoRename TEXT NOT NULL, 
    usePin TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id))`).catch((e) => {
        console.log("error", e);
    });

    await db.execute(`
        INSERT INTO settings (userId, theme, fontSize, animations, autoRename, usePin)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT(userId) DO UPDATE SET
        theme = excluded.theme,
        fontSize = excluded.fontSize,
        animations = excluded.animations,
        autoRename = excluded.autoRename,
        usePin = excluded.usePin
    `, [userId, formData.theme, formData.fontSize, formData.animations, formData.autoRename, formData.usePin]).catch((e) => {
        console.log("error", e);
    });

    await db.close();
}

export async function updateUserPin({
    userId,
    newPin
}: {
    userId: number,
    newPin: string
}) {
    const db = await Database.load("sqlite:main.db");

    await db.execute("UPDATE user SET pin = $1 WHERE id = $2", [newPin, userId])

    await db.close();
}

export async function getUserSettings({
    userId
}: {
    userId: number
}) {
    const db = await Database.load("sqlite:main.db");
    try {

        await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL UNIQUE, 
    theme TEXT NOT NULL, 
    fontSize TEXT NOT NULL, 
    animations TEXT NOT NULL, 
    autoRename TEXT NOT NULL, 
    usePin TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id))`).catch((e) => {
            console.log("error", e);
        });

        let settings: SettingSchema[] = await db.select("SELECT * from settings WHERE userId = $1", [userId])

        //console.log("settings", settings[0]);

        if (settings.length === 0) {
            return null;
        } else {
            ;
            return settings[0];
        }
    } catch (e) {
        console.log(e);
        ;
        return null;
    }


}

export async function turnOnPin({
    userId
}: {
    userId: number
}) {
    const db = await Database.load("sqlite:main.db");

    await db.execute("UPDATE settings SET usePin = 'On' WHERE userId = $1", [userId])

    await db.close();
}

export async function setCurrentUserGlobal({ userId }: { userId: number }) {
    const db = await Database.load("sqlite:main.db");

    // Use a constant ID since there will only ever be one record in this table.
    const GLOBAL_ID = 'GID99844589388427';

    try {

        // Ensure the global table exists
        await db.execute(`
            CREATE TABLE IF NOT EXISTS global (
                id TEXT PRIMARY KEY, 
                userId INTEGER NOT NULL
            )
        `);

        // Set the current user. The ON CONFLICT clause is used to upsert the userId for the constant ID.
        await db.execute(`
            INSERT INTO global (id, userId) 
            VALUES ($1, $2)
            ON CONFLICT(id) DO UPDATE SET 
            userId = excluded.userId
        `, [GLOBAL_ID, userId]);

    } catch (e) {
        await db.close();
        console.log(e);
        return false
    }

    return true
}

export async function getCurrentUserGlobal() {
    const db = await Database.load("sqlite:main.db");

    const GLOBAL_ID = 'GID99844589388427';

    try {
        // Ensure the global table exists
        await db.execute(`
        CREATE TABLE IF NOT EXISTS global (
        id TEXT PRIMARY KEY, 
        userId INTEGER NOT NULL
        )`);

        const GLOBAL_USER: Global[] = await db.select("SELECT * from global WHERE id = $1", [GLOBAL_ID])

        if (GLOBAL_USER) {
            //await db.close();
            return GLOBAL_USER[0];
        }

        return null;
    } catch (e) {
        await db.close();
        console.log(e);
        return null;
    }

}

export async function updateProfilePicture({
    userId,
    imagePath
}: {
    userId: number
    imagePath: string
}) {
    const db = await Database.load("sqlite:main.db");

    const imageUrl = convertFileSrc(imagePath);

    await db.execute("UPDATE user SET imagePath = $1 WHERE id = $2", [imageUrl, userId])

    await db.close();
}

export async function getProfilePicture({
    userId
}: {
    userId: number
}) {
    const db = await Database.load("sqlite:main.db");



    try {
        const image: string = await db.select("SELECT imagePath from user WHERE id = $1", [userId])

        if (image) {
            ;
            return image;
        }
    } catch (e) {
        console.log(e);
        ;
        return null;
    }

}

export async function deleteProfile({
    userId
}: {
    userId: number
}) {
    const db = await Database.load("sqlite:main.db");

    try {
        // Start a transaction
        await db.execute(`BEGIN TRANSACTION;`);

        // Delete all folders associated with the user
        await db.execute(`DELETE FROM folder WHERE userId = $1`, [userId]);

        // Delete all settings associated with the user
        await db.execute(`DELETE FROM settings WHERE userId = $1`, [userId]);

        // Finally, delete the user
        await db.execute(`DELETE FROM user WHERE id = $1`, [userId]);

        // Commit the transaction
        await db.execute(`COMMIT;`);
    } catch (e) {
        console.log(e);
        // If an error occurs, rollback the transaction
        await db.execute(`ROLLBACK;`);
    } finally {
        // Close the database connection
        await db.close();
    }
}

// export async function createNewWindow({ }) {
//     const webview = new WebviewWindow('my-main', {
//         url: '/dashboard'
//     });
//     webview.once('tauri://created', function () {
//         console.log("created");
//     });
//     webview.once('tauri://error', function (e) {
//         console.error(e);
//     });
// }
