const Header = ({name}) => <h1>{name}</h1>;

const Content = ({ parts }) =>
  parts.map((p) => {
    return (
      <p key={p.id}>
        {p.name} {p.exercises}
      </p>
    );
  });

const Total = ({ parts }) => {
  return (
    <p>Number of exercises {parts.reduce((sum, p) => sum + p.exercises, 0)}</p>
  );
};

const OneCourse = ({ name,parts }) => {
  return (
    <>
      <Header name={name} />
      <Content parts={parts} />
      <Total parts={parts} />
    </>
  );
};

const Courses = ({courses}) =>{
  return(
    <>
    {courses.map(p=>(
      <OneCourse key={p.id} name={p.name} parts={p.parts}/>
    ))}
    </>
  )

}

export default Courses;
