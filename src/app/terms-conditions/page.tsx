export default function TermsAndConditions() {
  // todo: add go back
  const termsConditions = [
    {
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas delectus alias, corporis temporibus reprehenderit asperiores sed ut quod. Nobis facere quam fugiat, exercitationem asperiores explicabo aperiam doloribus fuga ducimus impedit.",
    },
    {
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas delectus alias, corporis temporibus reprehenderit asperiores sed ut quod. Nobis facere quam fugiat, exercitationem asperiores explicabo aperiam doloribus fuga ducimus impedit.",
    },
    {
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas delectus alias, corporis temporibus reprehenderit asperiores sed ut quod. Nobis facere quam fugiat, exercitationem asperiores explicabo aperiam doloribus fuga ducimus impedit.",
    },
    {
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas delectus alias, corporis temporibus reprehenderit asperiores sed ut quod. Nobis facere quam fugiat, exercitationem asperiores explicabo aperiam doloribus fuga ducimus impedit.",
    },
    {
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas delectus alias, corporis temporibus reprehenderit asperiores sed ut quod. Nobis facere quam fugiat, exercitationem asperiores explicabo aperiam doloribus fuga ducimus impedit.",
    },
    {
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas delectus alias, corporis temporibus reprehenderit asperiores sed ut quod. Nobis facere quam fugiat, exercitationem asperiores explicabo aperiam doloribus fuga ducimus impedit.",
    },
    {
      title: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      description:
        "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptas delectus alias, corporis temporibus reprehenderit asperiores sed ut quod. Nobis facere quam fugiat, exercitationem asperiores explicabo aperiam doloribus fuga ducimus impedit.",
    },
  ]
  return (
    <>
      <div className="p-4 w-full">
        <p className="text-5xl w-full mt-8 mb-5 mx-4 font-bold text-seabrick-blue">
          Terms & Conditions
        </p>
        <div className="w-full">
          {termsConditions.map((d, i) => {
            return (
              <div key={i} className="w-full p-3">
                <p className="mt-1 text-2xl font-bold">{d.title}</p>
                <span className="text-lg">{d.description}</span>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
