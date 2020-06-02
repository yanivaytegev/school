module.exports = savePhoto = (files, uniqueNum, user, role) => {

    return new Promise((resolve, reject) => {
        if (files !== null) {
            const file = files.image

            let path = `${__dirname}/../client/src/photos/activities/${uniqueNum + file.name}`
            if (role) path = `${__dirname}/../client/src/photos/users/${role}/${uniqueNum + file.name}`

            file.mv(path, err => {
                if (err) return reject('failed to upload photo')
            })
            user.photo = uniqueNum + file.name;
        }
        return resolve(user)
    })
}