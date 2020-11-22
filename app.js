const { h } = Vue;
const card = {
    data: () => ({
        days: 1,
    }),
    methods: {
        add() {
            this.days++
        }
    },
}

const app = Vue.createApp({
    el: '#app',
    data: () => ({
        fields: {},
        edited: {},
        cards: [],
        hCards: [],
        rows: [],
        days: 5,
        asyncComponents: [],
    }),
    methods: {
        set(id, el) {
            this.fields[id] = el
        },
        async add() {
            try {
                const result = await fetch('single.html')
                const text = await result.text()
                this.rows.push(text)
            } catch (error) {
                console.log(error)
            }
        },
        async addEdit() {
            try {
                const result = await fetch('single-edit.html')
                const text = await result.text()
                const component = text.replaceAll(':id:', Math.floor(Math.random() * Math.floor(10000)))
                this.rows.push(component)
            } catch (error) {
                console.log(error)
            }
        },
        edit(id) {
            if (this.edited[id]) {
                this.fields[id].innerText = this.edited[id]
                delete this.edited[id]
                return
            }

            this.edited = {[id]: this.fields[id].innerText}
        },
        async addComponent() {
            try {
                const result = await fetch('single.html')
                const text = await result.text()
                this.cards.push(text)
            } catch (error) {
                console.log(error)
            }
        },
        async addHComponent() {
            try {
                const result = await fetch('single-async.html')
                const text = await result.text()
                this.hCards.push(text)
            } catch (error) {
                console.log(error)
            }
        },
        async addAsyncComponent() {
            const name = 'async-' + Math.floor(Math.random() * Math.floor(10000))
            const component = Vue.defineAsyncComponent(async () => {
                const result = await fetch('single-async.html')
                const text = await result.text()
                return {
                    ...card,
                    template: text,
                }
            })
            this.asyncComponents.push(name)
            app.component(name, component)
        }
    }
})

app.component('edit-form', {
    emits: ['edit'],
    props: ['edited', 'edit', 'id'],
    computed: {
        show() {
            return this.edited[this.id] !== undefined
        }
    },
    template:`
        <edit-field v-model="edited[id]" v-if="show"></edit-field>
        <button @click="$emit('edit', id)" type="button" class="ml-1 btn btn-primary" v-if="!show">Edit</button>
        <button @click="$emit('edit', id)" type="button" class="ml-1 btn btn-primary" v-if="show">Save</button>
    `
})

app.component('edit-field', {
    props: ['modelValue'],
    template: `<input :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="form-control" type="text"/>`
})

app.component('raw-html', {
    props: ["html"],
    render: function () {
        const render = Vue.compile(this.html || '')

        return render(this.$parent)
    },
})

app.component('card-component', {
    data: () => ({
        days: 1,
    }),
    methods: {
        add() {
            this.days++
        }
    },
    props: ["html"],
    render: function (context) {
        const render = Vue.compile(this.html || '')
        return render(context)
    },
})

app.component('h-card', {
    props: ["html"],
    render: function () {
        return h({...card, template: this.html || ''})
    },
})

app.mount('#app')
