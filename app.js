const app = Vue.createApp({
    el: '#app',
    data: () => ({
        cards: [],
        rows: [],
        days: 5,
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

app.mount('#app')
