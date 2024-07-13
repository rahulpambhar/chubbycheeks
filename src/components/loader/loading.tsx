interface Props {
    minHeight?: string | null
}


export default function Loading({ minHeight }: Props) {
    // Or a custom loading skeleton component
    return (
        <div className="row">
            <div className='col-lg-12 col-md-12 col-xl-12 col-xxl-12'>
                {minHeight ?
                    <div className='loader-spin' style={{ minHeight: minHeight }} >
                        <span className="loader"></span>
                    </div> :
                    <div className='loader-spin' >
                        <span className="loader"></span>
                    </div>
                }

            </div>
        </div>
    );
}