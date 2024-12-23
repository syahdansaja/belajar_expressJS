import { deleteUserDataScheduled } from "../tasks/deleteUserData.js";

test('testing task scheduling - delete user data unverificated function', () => {
    const result = deleteUserDataScheduled();
})