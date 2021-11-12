const { idBuild, Food, builderFood } = require('./utils/utils')
const BaseRepository = require('../repositories/baseRepository');


describe('BaseRepository', () => {
    const modelFood = BaseRepository(Food());
    const food = builderFood(idBuild)
    describe('get', () => {


        it('get', async () => {

            expect(await modelFood.get()).toEqual(
                expect.objectContaining(
                    food
                )
            );
        })


    })

    it('getById', async () => {

        expect(await modelFood.getById(idBuild)).toEqual(
            expect.objectContaining(
                food
            )
        );
    })

    it('post', async () => {
        const newFood = {
            name: "Hamburgesa",
            price: 2,
            type: "fast food",
            available: true,
        }
        expect(await modelFood.post(idBuild)).toEqual(
            expect.objectContaining(
                food
            )
        );
    })



})