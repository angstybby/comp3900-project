import ButtonPrimary from "../components/ButtonPrimary";

export default function Profile() {

    const profileTemp = {
        name: 'Edrick Koda',
        userType: 'Student',
        bio: 'insert bio here or some other details',
        email: 'z12345@student.unsw.edu',
        profilePic: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Windows_10_Default_Profile_Picture.svg/2048px-Windows_10_Default_Profile_Picture.svg.png'
    };

    return (
        <div className="min-h-screen items-center justify-center">
            <h1 className="text-3xl font-semibold text-center mt-10">Your Profile</h1>

            <div className="flex flex-col items-center justify-center mt-10"> 
                <img 
                    src={profileTemp.profilePic} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full"
                />
                <h2 className="text-2xl font-semibold mt-4">{profileTemp.name}</h2>
                <h2 className="text-xl mt-2">{profileTemp.userType}</h2>
                <p className="text-xl text-gray-600 mt-2">{profileTemp.bio}</p>
                <h3 className="text-sm text-gray-500 mt-2">{profileTemp.email}</h3>
            </div>

            <div className="mt-8 w-80 mx-auto" title="Edit Profile Button">
                <ButtonPrimary text="Edit Profile" url=""/>
            </div>

        </div>
    )
}