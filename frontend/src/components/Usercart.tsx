const Usercart = ({ type }: { type: string }) => {
    return (
        <div className='rounded-2xl odd:bg-lamaPurple even:bg-lamaYellow p-4 flex-1'>
            <div className="flex justify-between items-center">
                <span>2024/24</span>
                <img src="/more.png" alt="" width={20} height={20} />
            </div>
            <h1 className="text-white">1,234</h1>
            <h2>{type}</h2>
        </div>
    )
}

export default Usercart