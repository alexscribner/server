module.exports = (sequelize, DataTypes) => {
    const Pet = sequelize.define('pet', {
        nameOfPet: {
            type: DataTypes.STRING,
            allowNull: false
        },
        typeOfPet: {
            type: DataTypes.STRING,
            allowNull: false
        },
        breedOfPet: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ageOfPet: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        genderOfPet: {
            type: DataTypes.STRING,
            allowNull: false
        },
        ownerOfPet: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })
    return Pet;
}