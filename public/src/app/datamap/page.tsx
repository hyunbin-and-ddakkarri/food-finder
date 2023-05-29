class Circle {
    name!: string;
    width: number = 100;
    height: number = 100;
    background: string = "red";
    borderRaidus: number = 50;

    constructor(name?: string) {
        if (typeof name === "string") this.name = name;
    }
};

const categories = [
    { name: "Korean", elements: ["Bulgogi", "Ddeokbokki"] },
    { name: "Japanese", elements: ["Ramen", "Sushi"] },
]

const DataMap = () => {
    var circles = [];
    for (let i=0; i<categories.length; i++) {
        const circle = new Circle(categories[0].name);
        circles.push(circle);
    }

    return (
        <div>
            <h1>
                Hi
            </h1>
            {
                circles.map((circle) => (
                    <div style={{width: "100px", height: "100px", background: "white", borderRadius: "50px"}}></div>
                ))
            }
        </div>
    )
}

export default DataMap;