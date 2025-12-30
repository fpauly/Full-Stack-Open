const Header = (props)=> <h1>{props.course.name}</h1>

const Content = ({parts})=>(
    parts.map(p=>{
        return(
            <p key={p.id}>
                {p.name} {p.exercises}
            </p>
        )
    })
)

const Total = ({parts}) => {
    return (
        <p>Number of exercises {parts.reduce((sum,p)=>sum+p.exercises,0)}</p>
    )
}

const Course = ({course}) => {
    return(
        <>
        <Header course = {course} />
        <Content parts={ course.parts} />
        <Total parts={course.parts}/>
        </>
    )
}

export default Course