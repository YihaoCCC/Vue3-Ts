import { createStore } from "vuex";

const store = createStore({
    state: () => {
        return {
            name: '柴渴',
            age: 18
        }
    },
    mutations: {
        changeName(state, name) {
            state.name = name
        },
        changeAge(state, age){
            state.age = age
        }
    }

})

export default store