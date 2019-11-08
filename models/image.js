module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('image', {
        location: {
            type: DataTypes.STRING,
            allowNull: true
        },
        owner_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        posted_by: {
            type: DataTypes.STRING,
            allowNull: false
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })
    return Image;
}