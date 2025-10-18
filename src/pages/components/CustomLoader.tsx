import '../../styles/custom-loader.css';

export const CustomLoader = () => {
    return (
        <div className='container-main-custom-loader'>
            <div className="frame">
                <div className="grid">
                    {/* <div>
                        <div className="loader-6">
                            <div className="loader-square"></div>
                            <div className="loader-square"></div>
                            <div className="loader-square"></div>
                            <div className="loader-square"></div>
                            <div className="loader-square"></div>
                            <div className="loader-square"></div>
                            <div className="loader-square"></div>
                        </div>
                    </div> */}

                    <div>
                        <div className="loader-4">
                            <div className="box1"></div>
                            <div className="box2"></div>
                            <div className="box3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
