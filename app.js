const app = Vue.createApp({
    el: '#app',
    data: () => ({
        cards: [],
        rows: [],
        days: 5,
        cardComponent: 'card-component'
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
    props: ["html"],
    render: function () {
        const render = Vue.compile(this.html)
        return render(this.$parent)
    },
})

app.component('card-component', {
    props: ["html"],
    data: () => ({
        days: 1,
    }),
    methods: {
        add() {
            this.days++
        }
    },
    render: function (context) {
        const render = Vue.compile(this.html)
        return render(context)
    },
})

app.mount('#app')
