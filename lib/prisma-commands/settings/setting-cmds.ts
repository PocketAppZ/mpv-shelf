import Database from "tauri-plugin-sql-api"
import { SettingSchema } from "../../../src/app/settings/page";
import { convertFileSrc } from '@tauri-apps/api/tauri';

// when adding a new setting value, update the default state in newUser
// update this when adding a new setting value
export async function updateSettings({
    formData,
    userId
}: {
    formData: SettingSchema
    userId: number
}) {
    const db = await Database.load("sqlite:main.db");

    console.log("updating settings for user:", userId, formData);

    await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL UNIQUE, 
    fontSize TEXT NOT NULL, 
    animations TEXT NOT NULL, 
    autoPlay TEXT NOT NULL,
    autoRename TEXT NOT NULL, 
    usePin TEXT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user(id))`).catch((e) => {
        // console.log ("error", e);
    });

    // if new setting add into first row and update values + $
    await db.execute(`
        INSERT INTO settings (userId, fontSize, animations, autoPlay, autoRename, usePin)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT(userId) DO UPDATE SET
        fontSize = excluded.fontSize,
        animations = excluded.animations,
        autoPlay = excluded.autoPlay,
        autoRename = excluded.autoRename,
        usePin = excluded.usePin
    `, [userId, formData.fontSize, formData.animations, formData.autoPlay, formData.autoRename, formData.usePin]).catch((e) => {
        // console.log ("error", e);
    });

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

// update this when adding a new setting value
export async function getUserSettings({
    userId
}: {
    userId: number
}) {
    const db = await Database.load("sqlite:main.db");
    try {

        await db.execute(`
        CREATE TABLE IF NOT EXISTS settings (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER NOT NULL UNIQUE, 
            fontSize TEXT NOT NULL, 
            animations TEXT NOT NULL, 
            autoPlay TEXT NOT NULL,
            autoRename TEXT NOT NULL, 
            usePin TEXT NOT NULL,
            FOREIGN KEY (userId) REFERENCES user(id))`).catch((e) => {
            // console.log ("error", e);
        });

        let settings: SettingSchema[] = await db.select("SELECT * from settings WHERE userId = $1", [userId])

        // console.log  ("settings", settings[0]);

        if (settings.length === 0) {
            return null;
        } else {
            ;
            return settings[0];
        }
    } catch (e) {
        // console.log (e);
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
        // console.log (e);
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
        // Delete all folders associated with the user
        await db.execute(`DELETE FROM folder WHERE userId = $1`, [userId]);

        // Delete all settings associated with the user
        await db.execute(`DELETE FROM settings WHERE userId = $1`, [userId]);

        await db.execute(`DELETE FROM video WHERE userId = $1`, [userId]);

        // Finally, delete the user
        await db.execute(`DELETE FROM user WHERE id = $1`, [userId]);

        // console.log ("deleteProfile() => Deleted user:", userId);
    } catch (e) {
        await db.close();
        // console.log (e);
    } finally {
        // Close the database connection
        await db.close();
    }
}