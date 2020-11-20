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
        cards: [],
        hCards: [],
        rows: [],
        days: 5,
        asyncComponents: [],
    }),
    methods: {
        async add() {
            try {
                const result = await fetch('single.html')
                const text = await result.text()
                this.rows.push(text)
            } catch (error) {
                console.log(error)
            }
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

app.component('raw-html', {
    data: () => ({
        template: null
    }),
    props: ["html"],
    render: function () {
        if (this.template) {
            return this.template
        }

        const render = Vue.compile(this.html || '')
        this.template = render(this.$parent)

        return this.template
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
