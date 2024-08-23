const AnimatedText = ({ text }: { text: string }) => {
  return (
    <div className="home__redirect">
      <h2>
        {text.split("").map((char, index) => (
          <span key={index} style={{ "--delay": index }}>
            {char}
          </span>
        ))}
      </h2>
    </div>
  );
};

export default AnimatedText;
