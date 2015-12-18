/**
 * Created by youyi on 2015/10/13.
 */
Project = new Mongo.Collection("project");

Feature = new Mongo.Collection("feature");

Case = new Mongo.Collection("case");

Comment = new Mongo.Collection("comment");

Defect = new Mongo.Collection("defect");

DefectMining = new Mongo.Collection("defectMining");

Image = new FS.Collection("image", {
    stores: [
//        new FS.Store.FileSystem("thumbs", { transformWrite: function(fileObj, readStream, writeStream) {
//                // Transform the image into a 100x100px thumbnail
//                gm(readStream, fileObj.name()).resize('100', '100').stream().pipe(writeStream);
//            }
//        }),
        new FS.Store.FileSystem("images", {path: "/uploads"})
    ],
    filter: {
        allow: {
            contentTypes: ['image/*'], //allow only images in this FS.Collection
            extensions: ['jpg','png','gif','ico']
        },
        onInvalid: function (message) {
            if (Meteor.isClient) {
                sAlert.error(message);
            } else {
                console.log(message);
            }
        }
    }
});

Image.allow({
    insert: function () {
        return true;
    },
    remove: function () {
        return true;
    },
    update: function () {
        return true;
    },
    download: function () {
        return true;
    }
});