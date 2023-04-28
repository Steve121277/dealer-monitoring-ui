import React from "react";

export default function PrintTree(props: { data: any }) {
  const [tree, setTree] = React.useState<any>();
  var keyCounter = 0;

  React.useEffect(() => {
    var _tree: any[] = [];

    const generateTree = (data: any, deep: number): any[] => {
      _tree.push(
        <span className="not_space" key={keyCounter++}>
          {"{"}
        </span>
      );
      _tree.push(<span key={keyCounter++} className="row"></span>);
      _tree.push(<br key={keyCounter++} />);

      Object.getOwnPropertyNames(data).map((e) => {
        _tree.push(
          <span key={keyCounter++}>
            {Array.from(new Array(deep * 2 + 2)).map((_) => (
              <span key={keyCounter++}>&nbsp;</span>
            ))}
          </span>
        );

        _tree.push(
          <span className="not_space" key={keyCounter++}>
            "{e}":{" "}
          </span>
        );

        if (typeof data[e] === "object" && data[e] !== null)
          generateTree(data[e], deep + 1);
        else
          _tree.push(
            <span className="not_space" key={keyCounter++}>
              {data[e]
                ? data[e].toString()
                : data[e] === null
                ? "null"
                : "false"}
            </span>
          );

        _tree.push(<span key={keyCounter++} className="row"></span>);
        _tree.push(<br key={keyCounter++} />);
      });

      _tree.push(
        <span key={keyCounter++}>
          {Array.from(new Array(deep * 2)).map((_) => (
            <span key={keyCounter++}>&nbsp;</span>
          ))}
        </span>
      );

      _tree.push(<span key={keyCounter++}>{"},"}</span>);
      _tree.push(<span key={keyCounter++} className="row"></span>);
      _tree.push(<br key={keyCounter++} />);
      return _tree;
    };

    if (props.data) setTree(generateTree(props.data, 0));
  }, [props]);

  return (
    <div className="print_tree">
      <pre>{tree}</pre>
    </div>
  );
}
